package threadpool;

import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import waitabblequeue.WaitableQueue;
import waitabblequeue.WaitableQueueConditionVar;

public class ThreadPool implements Executor {
	private static final int DEFAULT_NTHREADS = 10;
	private int numWorkers;
	private final static Priority DEFAULT_PRIORITY = Priority.MEDIUM;
	private final WaitableQueue<Task<?>> taskQueue = new WaitableQueueConditionVar<>();
	private final List<Worker> workers = new LinkedList<>();
	private boolean isShutdown = false;
	private boolean isPaused = false;
	private final Semaphore blockTasksSem = new Semaphore(0);
	private final static int TOP_PRIORITY = Priority.HIGH.getPriority() + 1;
	private final static int BOTTOM_PRIORITY = Priority.LOW.getPriority() - 1;
	
	public ThreadPool() {
		this(DEFAULT_NTHREADS);
	}
	
	public ThreadPool(int numThreads) {
		if (numWorkers < 0) { throw new IllegalArgumentException(); }
		numWorkers = numThreads;
		startWorkers(numThreads);
	}
	
	public <T> Future<T> submit(Callable<T> callable, Priority priority) {
		if (isShutdown) { throw new RejectedExecutionException(); }
		if (callable == null) { throw new NullPointerException(); }
		
		Task<T> newTask = new Task<>(callable, priority.getPriority());
		taskQueue.enqueue(newTask);
		
		return newTask.getFuture();
	}
	
	public <T> Future<T> submit(Callable<T> callable) {
		return submit(callable, DEFAULT_PRIORITY);
	}
	
	public Future<?> submit(Runnable runnable, Priority priority) {
		return submit(Executors.callable(runnable), priority);
	}
	
	public <T> Future<T> submit(Runnable runnable, Priority priority, T result) {
		return submit(Executors.callable(runnable, result), priority);
	}
	
	public void setNumThreads(int newNumThreads) {
		if (numWorkers < newNumThreads) {
			if (isPaused) {
				enqueueTask(getPasuingCallable(), newNumThreads - numWorkers, TOP_PRIORITY);
			}
			startWorkers(newNumThreads - numWorkers);
		} else {
			enqueueTask(getStoppingCallable(), numWorkers - newNumThreads, TOP_PRIORITY);
		}
		
		numWorkers = newNumThreads;
	}
	
	public void pause() {
		if (!isPaused) {
			isPaused = true;
			blockTasksSem.drainPermits();
			enqueueTask(getPasuingCallable(), numWorkers, TOP_PRIORITY);
		}
	}
	
	public void resume() {
		if (isPaused) {
			isPaused = false;
			blockTasksSem.release(workers.size());
		}
	}
	
	public void shutdown() {
		enqueueTask(getStoppingCallable(), numWorkers, BOTTOM_PRIORITY);
		isShutdown = true;
	}
	
	public boolean awaitTermination(long timeout, TimeUnit timeUnit) throws InterruptedException {
		long endTimeInMillis = System.currentTimeMillis() + timeUnit.toMillis(timeout);
		long timePassed = endTimeInMillis - System.currentTimeMillis();
		
		for (Worker worker : workers) {
			worker.join(timePassed);
			timePassed = endTimeInMillis - System.currentTimeMillis();
			if (timePassed <= 0) {
				return false;
			}
		}
	
		return true;
	}
	
	@Override
	public void execute(Runnable runnable) {
		submit(runnable, DEFAULT_PRIORITY);
	}
	
	public enum Priority {
		HIGH(10),
		MEDIUM(5),
		LOW(1);
		
		private final int priority;
		
		Priority(int priority) {
			this.priority = priority;
		}
		
		public int getPriority() {
			return priority;
		}
	}
	
	private void startWorkers(int numThreads) {
		for (int i = 0; i < numThreads; ++i) {
			Worker newWorker = new Worker();
			workers.add(newWorker);
			newWorker.start();
		}
	}
	
	private Callable<?> getStoppingCallable() {
		return () -> {
			((Worker)Thread.currentThread()).shouldStop = true;
			return null; 
		};
	}
	
	private Callable<?> getPasuingCallable() {
		return () -> {
			blockTasksSem.acquire();
			return null;
		};
	}
	
	private void enqueueTask(Callable<?> callable, int numThreads, int priority) {
		Task<?> task = new Task<>(callable, priority);
		
		for (int i = 0; i < numThreads; ++i) {
			taskQueue.enqueue(task);
		}
	}
	
	private class Task<T> implements Comparable<Task<?>> {
		private final Callable<T> callable;
		private final FutureTask futureTask;
		private int priority;
		private final Semaphore hasResultSem = new Semaphore(0);
		
		public Task(Callable<T> callable, int priority) {
			this.callable = callable;
			this.priority = priority;
			futureTask = new FutureTask();
		}
		
		public Future<T> getFuture() {
			return futureTask;
		}
		
		public void execute() {
			try {
				futureTask.result = callable.call();
				hasResultSem.release();
				futureTask.isDone = true;
			} catch (Exception e) {
				futureTask.exceptionOccured = true;
				futureTask.failureCause = e;
			}
		} 
		
		@Override
		public int compareTo(Task<?> other) {
			return other.priority - priority;
		}
		
		private class FutureTask implements Future<T> {
			private boolean isCancelled = false;
			private volatile boolean isDone = false;
			private boolean exceptionOccured = false;
			private Exception failureCause = null;
			private T result;
			
			@Override
			public boolean cancel(boolean mayInterruptIfRunning) {
				boolean wasRemoved = true;
				
				if (!isCancelled) {
					wasRemoved = taskQueue.remove(Task.this);
					if (wasRemoved) {
						isCancelled = true;
						isDone = true;
					}
				}
				
				return wasRemoved;
			}

			@Override
			public T get() throws InterruptedException, ExecutionException {
				try {
					return get(Long.MAX_VALUE, TimeUnit.DAYS);
				} catch (TimeoutException e) {
					throw new UnknownError("a problem occured with the JVM");
				}
			}

			@Override
			public T get(long timeout, TimeUnit timeUnit)
					throws InterruptedException, ExecutionException, TimeoutException {
				if (isCancelled) { throw new CancellationException(); }
				if (exceptionOccured) { throw new ExecutionException(failureCause); }
				if (!isDone) {
					if (!hasResultSem.tryAcquire(timeout, timeUnit)) {
						throw new TimeoutException();
					}
					hasResultSem.release();
				}
				
				return result;
			}

			@Override
			public boolean isCancelled() {
				return isCancelled;
			}

			@Override
			public boolean isDone() {
				return isDone;
			}	
		}
	}

	private class Worker extends Thread {
		private boolean shouldStop = false;
		
		@Override
		public void run() {
			while (!shouldStop) {
				try {
					Task<?> curTask = taskQueue.dequeue();
					curTask.execute();
				} catch (InterruptedException e1) {
					e1.printStackTrace();
				}
			}
		}
	}
}