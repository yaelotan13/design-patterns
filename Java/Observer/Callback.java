package observer;

import java.util.function.Consumer;

public class Callback<T> {
	private Consumer<T> onUpdate;
	private Worker onStop;
	private Dispatcher<? extends T> dispatcher;
	
	public Callback(Consumer<T> onUpdate, Worker onStop) {
		if (onUpdate == null) {
			throw new IllegalArgumentException();
		}
		this.onUpdate = onUpdate;
		this.onStop = onStop;
	}
	
	public void setDispatcher(Dispatcher<? extends T> dispatcher) {
		this.dispatcher = dispatcher;
	}
	
	public void update(T data) {
		onUpdate.accept(data);
	}
	
	public void stop() {
		if (onStop == null) {
			return;
		}
		onStop.doWork();
	}
	
	public void unsubscribe() {
		dispatcher.unsubscribe(this);
	}
}
