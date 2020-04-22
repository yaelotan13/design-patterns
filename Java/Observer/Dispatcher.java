package observer;

import java.util.ArrayList;
import java.util.List;

public class Dispatcher<T> {
	private List<Callback<? super T>> callbacks = new ArrayList<>();
	
	public void subscribe(Callback<? super T> callback) {
		callbacks.add(callback);
		callback.setDispatcher(this);
	}
	
	public void unsubscribe(Callback<? super T> callback) {
		callbacks.remove(callback);
		callback.setDispatcher(null);
	}
	
	public void notifySubscribers(T data) {
		for (Callback<? super T> callback : callbacks) {
			callback.update(data);
			callback.setDispatcher(null);
		}
	}
	
	public void stop() {
		for (Callback<? super T> callback : callbacks) {
			callback.stop();
		}
		
		callbacks = new ArrayList<>();
	}
}
