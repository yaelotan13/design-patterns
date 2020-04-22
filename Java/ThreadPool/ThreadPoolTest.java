package threadpool;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.junit.jupiter.api.Test;

import threadpool.ThreadPool.Priority;

class ThreadPoolTest {
	
	@Test
	void testCallableWithPrioritySubmit() {
		final int NUM_THREADS = 3;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> reachedList = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				reachedList.add("reached");
				return null;
				
			}, Priority.MEDIUM);
		}
		
		for (String str : reachedList) {
			assertEquals(str, "reached");
		}
		
	}
	
	@Test
	void testCallableWithoutPrioritySubmit() {
		final int NUM_THREADS = 3;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> reachedList = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				reachedList.add("reached");
				return null;
				
			});
		}
		
		for (String str : reachedList) {
			assertEquals(str, "reached");
		}
		
	}
	
	@Test
	void testRunnableWithPrioritySubmit() {
		final int NUM_THREADS = 3;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> reachedList = new ArrayList<>();
		Runnable runnable = () -> {
			reachedList.add("reached");
		};
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(runnable, Priority.MEDIUM);
		}
		
		for (String str : reachedList) {
			assertEquals(str, "reached");
		}
		
	}
	
	@Test
	void testRunnableWithParameterResultSubmit() throws InterruptedException {
		final int NUM_THREADS = 3;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		final String[] resultArr = new String[3];
		
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			switch (i) {
			case 0: 
				pool.submit(() -> {
					resultArr[0] = "Thread 1";
				}, Priority.MEDIUM, resultArr[0]);
				break;
			case 1:
				pool.submit(() -> {
					resultArr[1] = "Thread 2";
				}, Priority.MEDIUM, resultArr[1]);
				break;
			case 2:
				pool.submit(() -> {
					resultArr[2] = "Thread 3";
				}, Priority.MEDIUM, resultArr[2]);
				break;
			}
		}
		
		Thread.sleep(300);
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			switch (i) {
			case 0: 
				assertEquals("Thread 1", resultArr[i]);
				break;
			case 1:
				assertEquals("Thread 2", resultArr[i]);
				break;
			case 2:
				assertEquals("Thread 3", resultArr[i]);
				break;
			}
		}
		
	}
	
	@Test
	void testSetNumThreadsToHightNum() throws InterruptedException {
		final int NUM_THREADS = 2;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> helloList = new ArrayList<>();
		
		for (int i =0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				try {
					Thread.sleep(3000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}, Priority.MEDIUM);
		}
		
		pool.setNumThreads(NUM_THREADS + 1);
		
		pool.submit(() -> {
			helloList.add("Hello");
		}, Priority.MEDIUM);
		
		Thread.sleep(100);
		
		assertEquals("Hello", helloList.get(0));
	}
	
	@Test void testSetNumToLowerNum() throws InterruptedException {
		final int NUM_THREADS = 2;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> threadName = new ArrayList<>();
		
		pool.setNumThreads(10);
		
		Thread.sleep(100);
		
		for (int i = 0; i < 20; ++i) {
			pool.submit(() -> {
				//do nothing
			}, Priority.MEDIUM);
			
		}
		
		pool.setNumThreads(1);
		Thread.sleep(500);
		
		for (int i = 0; i < 10; ++i) {
			pool.submit(() -> {
				threadName.add(Thread.currentThread().getName());
			}, Priority.MEDIUM);
			
		}
		
		Thread.sleep(100);
		
		
		for (int i = 0; i < threadName.size() - 1; ++i) {
			assertEquals(threadName.get(i + 1), threadName.get(i));
		}		
	}
	
	@Test 
	void testPause() throws InterruptedException {
		final int NUM_THREADS = 10;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> threadName = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			threadName.add(i, null);
		}
		
		pool.pause();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				threadName.add(Thread.currentThread().getName());
			}, Priority.MEDIUM);
			
		}
		
		Thread.sleep(1000);
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			assertNull(threadName.get(i));
		}
	}
	
	@Test
	void testResum() throws InterruptedException {
		final int NUM_THREADS = 10;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> threadName = new ArrayList<>();
		
		pool.pause();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				threadName.add(Thread.currentThread().getName());
			}, Priority.MEDIUM);
			
		}
		
		Thread.sleep(500);
		
		pool.resume();
		
		Thread.sleep(1000);
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			assertNotNull(threadName.get(i));
		}
	}
	
	//@Test 
	void testShutdownTaskCantBeSubmitted() throws InterruptedException {
		final int NUM_THREADS = 4;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> threadName = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				threadName.add(Thread.currentThread().getName());
			}, Priority.MEDIUM);
		}
		
		Thread.sleep(500);
		
		assertEquals(NUM_THREADS, threadName.size());
		
		pool.shutdown();
		
		Thread.sleep(500);
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				threadName.add(Thread.currentThread().getName());
			}, Priority.MEDIUM);
			
		}
		
		Thread.sleep(100);
		
		assertEquals(NUM_THREADS, threadName.size());
	}
	
	@Test
	void testAwaitTerminationTimeoutShouldElapse() throws InterruptedException {
		final int NUM_THREADS = 4;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> threadName = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				try {
					Thread.sleep(2500);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				threadName.add(Thread.currentThread().getName());
			}, Priority.MEDIUM);
		}
		
		pool.shutdown();
		boolean wasTerminated = pool.awaitTermination(2, TimeUnit.SECONDS);
		
		assertFalse(wasTerminated);
	}
	
	@Test
	void testAwaitTerminationTimeoutShouldNotElape() throws InterruptedException {
		final int NUM_THREADS = 4;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<String> threadName = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			pool.submit(() -> {
				try {
					Thread.sleep(100);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				threadName.add(Thread.currentThread().getName());
			}, Priority.MEDIUM);
		}
		
		pool.shutdown();
		boolean wasTerminated = pool.awaitTermination(2, TimeUnit.SECONDS);
		
		assertTrue(wasTerminated);
	}
	
	@Test
	void testFutureGet() throws InterruptedException, ExecutionException {
		final int NUM_THREADS = 3;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<Future<String>> futureList = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			Future<String> future = pool.submit(() -> {
				return Thread.currentThread().getName();
			});
			
			futureList.add(future);
		}
		
		for (Future<String> future : futureList) {
			assertNotNull(future.get());
		}
	}
	
	@Test
	void testFutureGetTaskNotAvailable() throws InterruptedException, ExecutionException, TimeoutException {
		final int NUM_THREADS = 3;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<Future<String>> futureList = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			Future<String> future = pool.submit(() -> {
				Thread.sleep(100);
				return Thread.currentThread().getName();
			});
			
			futureList.add(future);
		}
		
		for (Future<String> future : futureList) {
			assertNotNull(future.get(2, TimeUnit.SECONDS));
		}
	}
	
	@Test
	void testGetOnALongTask() throws InterruptedException, ExecutionException, TimeoutException {
		final int NUM_THREADS = 1;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		long startTime = System.currentTimeMillis();
		
		Future<String> future = pool.submit(() -> {
			Thread.sleep(2000);
			return Thread.currentThread().getName();
		});
		
		assertNotNull(future.get());
		long endTime = System.currentTimeMillis() - startTime;
		System.out.println(endTime);
		assertTrue(endTime < 2500 && endTime > 1800);
	}
	
	//@Test
	void testCancelTaskIsNotOnQueue() {
		final int NUM_THREADS = 3;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<Future<String>> futureList = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			Future<String> future = pool.submit(() -> {
				Thread.sleep(1000);
				return Thread.currentThread().getName();
			});
			
			futureList.add(future);
		}
		
		@SuppressWarnings("unchecked")
		Future<String> removeMe = (Future<String>) pool.submit(() -> {
			//do nothing
		}, Priority.MEDIUM);
		
		assertTrue(removeMe.cancel(false));
	}
	
	@Test
	void testCancelTaskIsOnQueue() throws InterruptedException {
		final int NUM_THREADS = 2;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		Future<String> removeMe = null;
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			if (i == 0) {
				removeMe = pool.submit(() -> {
					return Thread.currentThread().getName();
				});
			} else {
				pool.submit(() -> {
					return Thread.currentThread().getName();
				});
			}
		}
		
		Thread.sleep(500);
		assertFalse(removeMe.cancel(false));
	}
	
	@Test
	void testIsCancelledOnACancelledFuture() {
		final int NUM_THREADS = 3;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		List<Future<String>> futureList = new ArrayList<>();
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			Future<String> future = pool.submit(() -> {
				Thread.sleep(1000);
				return Thread.currentThread().getName();
			});
			
			futureList.add(future);
		}
		
		@SuppressWarnings("unchecked")
		Future<String> removeMe = (Future<String>) pool.submit(() -> {
			//do nothing
		}, Priority.MEDIUM);
		
		assertTrue(removeMe.cancel(false));
		assertTrue(removeMe.isCancelled());
	}
	
	@Test
	void testIsCancelledOnANonCancelledFuture() {
		final int NUM_THREADS = 2;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		Future<String> removeMe = null;
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			if (i == 0) {
				removeMe = pool.submit(() -> {
					return Thread.currentThread().getName();
				});
			} else {
				pool.submit(() -> {
					Thread.sleep(1000);
					return Thread.currentThread().getName();
				});
			}
		}
		
		assertFalse(removeMe.isCancelled());
	}
	
	
	@Test
	void testIsDoneOnANonFinishedTask() {
		final int NUM_THREADS = 2;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		Future<String> notDoneYet = null;
		
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			if (i == 0) {
				pool.submit(() -> {
					return Thread.currentThread().getName();
				});
			} else {
				notDoneYet = pool.submit(() -> {
					Thread.sleep(1000);
					return Thread.currentThread().getName();
				});
			}
		}
		
		assertFalse(notDoneYet.isDone());
	}
	
	@Test
	void testIsDoneOnAFinishedTask() {
		final int NUM_THREADS = 2;
		ThreadPool pool = new ThreadPool(NUM_THREADS);
		Future<String> finished = null;
		
		
		for (int i = 0; i < NUM_THREADS; ++i) {
			if (i == 0) {
				finished = pool.submit(() -> {
					return Thread.currentThread().getName();
				});
			} else {
				pool.submit(() -> {
					Thread.sleep(1000);
					return Thread.currentThread().getName();
				});
			}
		}
		
		assertTrue(finished.isDone());
	}
}
