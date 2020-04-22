package factory;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class Factory<K,D,T> {
	private Map<K, Function<D,? extends T>> mapOfFunctions = new HashMap<>();

	public T create(K key) {
		return create(key, null);
	}
	
	public T create(K key, D data) {
		if (!mapOfFunctions.containsKey(key)) {
			throw new IllegalArgumentException();
		}
		return mapOfFunctions.get(key).apply(data);
	}
	
	public void add(K key, Function<D, ? extends T> func) {
		mapOfFunctions.put(key, func);
	}
}
