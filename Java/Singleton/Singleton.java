package designpatterns;

public class Singleton {
	public static void main(String[] args) {
		Singleton8 instance = Singleton8.INSTANCE;
		int number = 10;
		instance.setValue(number);
	}
}

// not thread safe
class Singleton1 {
	private static Singleton1 instance;
	
	private Singleton1() {}
	
	public static Singleton1 getInstance() {
		if (null == instance) {
			instance = new Singleton1();	
		}
		
		return instance;
	}
}

// not thread safe
class Singleton2 {
	private static Singleton2 instance;
	
	private Singleton2() {}
	
	public synchronized static Singleton2 getInstance() {
		if (null == instance) {
			instance = new Singleton2();
		}
		
		return instance;
	}
}

// not thread safe
class Singleton3 {
	private static Singleton3 instance;
	
	private Singleton3() {}
	
	public static Singleton3 getInstance() {
		if (null == instance) {			
			synchronized(Singleton3.class) {
				instance = new Singleton3();
			}		
		}
		
		return instance;
	}
}

// double locking, not thread safe
class Singleton4 {
	private static Singleton4 instance;
	
	private Singleton4() {}
	
	public static Singleton4 getInstance() {
		if (null == instance) {
			synchronized(Singleton4.class) {
				if (null == instance) {
					instance = new Singleton4();
				}
			}
		}
		
		return instance;
	}
}

//thread safe - double locking + volatile keyword
class Singleton5 {
	private static volatile Singleton5 instance;
	
	private Singleton5() {}
	
	public static Singleton5 getInstance() {
		if (null == instance) {
			synchronized(Singleton5.class) {
				if(null == instance) {
					instance = new Singleton5();
				}
			}
		}
		
		return instance;
	}
}

//thread safe but early initializing
class Singleton6 {
	private static final Singleton6 instance = new Singleton6();
	
	private Singleton6() {}
	
	public static Singleton6 getInstance() {
		return instance;
	}
}

// both thread safe and lazy initializing 
class Singleton7 {
	private static class SingletonHolder {
		 static Singleton7 instance = new Singleton7();
	}
	
	private Singleton7() {}
	
	public static Singleton7 getInstance() {
		return SingletonHolder.instance;
	}
}

//enum implementation
enum Singleton8 {
	INSTANCE;
	
	private int value;
	
	public int getValue() {
		return value;
	}
	
	public void setValue(int value) {
		this.value = value;
	}
	
	/*public static Singleton8 getInstance() {
		return INSTANCE;
	}*/
}