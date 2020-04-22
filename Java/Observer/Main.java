package observer;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class Main {
	public static void main(String[] args) {
		Person yael = new Adult("Yael", Gender.FEMALE);
		Person hadar = new Adult("Hadar", Gender.MALE);
		Person albi = new Teenager("Albi", Gender.FEMALE);
		Person jeda = new Teenager("Jeda", Gender.MALE);
		
		Newspaper<String> laisha = new Lahisha();
		Newspaper<String> maarivLanoar = new MaarivLanoar();
		Newspaper<String> blaizer = new Blaizer();
		
		yael.register(laisha);
		hadar.register(blaizer);
		albi.register(maarivLanoar);
		jeda.register(maarivLanoar);
		
		System.out.println("laisha - number of substriction: " + laisha.numberOfSubstrictions());
		System.out.println("blaizer - number of substriction: " + blaizer.numberOfSubstrictions());
		System.out.println("maarivLanoar - number of substriction: " + maarivLanoar.numberOfSubstrictions());
		System.out.println();
		
		laisha.sendMessage("Hola beautiful Lahisha redear, you will get me every " + laisha.dayOfDistribution());
		maarivLanoar.sendMessage("HEY you cool MaarivLanoar readers, you will get me every " + maarivLanoar.dayOfDistribution());
		blaizer.sendMessage("Yoo dude from Blaizer, you will get me every " + blaizer.dayOfDistribution());
		
		System.out.println();
		laisha.sendMessage("the cost of Lahisha would raise to " + (laisha.monthlyRate() + 2) + " starting next week");
		maarivLanoar.sendMessage("unfortunatly our cost would raise to " + (maarivLanoar.monthlyRate() + 10) + " starting next month");
		blaizer.sendMessage("Yoo dude from Blaizer, out cost stayes " + blaizer.monthlyRate() + " forever!!!");
		
		System.out.println();
		laisha.stop();
		
		System.out.println();
		jeda.stopSubscription(maarivLanoar);
		maarivLanoar.sendMessage("I am so glad you stayed!");
		
		hadar.stopSubscription(blaizer);
		albi.stopSubscription(maarivLanoar);
		
		System.out.println();
		System.out.println("after all left me :(");
		System.out.println("laisha - number of substriction: " + laisha.numberOfSubstrictions());
		System.out.println("blaizer - number of substriction: " + blaizer.numberOfSubstrictions());
		System.out.println("maarivLanoar - number of substriction: " + maarivLanoar.numberOfSubstrictions());
		System.out.println();
	}
}

enum Gender {
	MALE, FEMALE;
}

enum DaysOfTheWeek {
	SUNDAY, MONDAY, TUESDAY, WENDSDAY, THURSDAY, FRIDAY, SUTERDAY;
}

interface Person {
	String getName();
	Gender getGender();
	void register(Newspaper<String> newspaper);
	void stopSubscription(Newspaper<String> newspaper);
}

interface Newspaper<T> {
	int monthlyRate();
	DaysOfTheWeek dayOfDistribution();
	void subscribe(Callback<T> callback);
	void unsubscribe(Callback<T> callback);
	void sendMessage(String messege);
	int numberOfSubstrictions();
	void stop();
}

class Lahisha implements Newspaper<String> {
	Dispatcher<String> dispacherOfLahisha = new Dispatcher<>();
	
	public int numberOfSubstrictions() {
		return dispacherOfLahisha.callbacks.size();
	}
	
	@Override
	public int monthlyRate() {
		return 10;
	}

	@Override
	public DaysOfTheWeek dayOfDistribution() {
		return DaysOfTheWeek.TUESDAY;
	}

	@Override
	public void subscribe(Callback<String> callback) {
		dispacherOfLahisha.subscribe(callback);
	}

	@Override
	public void unsubscribe(Callback<String> callback) {
		dispacherOfLahisha.unsubscribe(callback);
		
	}

	@Override
	public void sendMessage(String messege) {
		dispacherOfLahisha.notifySubscribers(messege);
	}

	@Override
	public void stop() {
		dispacherOfLahisha.stop();
	}
}

class MaarivLanoar implements Newspaper<String> {
	Dispatcher<String> dispacherOfMaarivLanoar = new Dispatcher<>();
	Callback<String> callback;
	
	@Override
	public int monthlyRate() {
		return 15;
	}

	@Override
	public DaysOfTheWeek dayOfDistribution() {
		return DaysOfTheWeek.WENDSDAY;
	}

	@Override
	public void subscribe(Callback<String> callback) {
		dispacherOfMaarivLanoar.subscribe(callback);
	}

	@Override
	public void unsubscribe(Callback<String> callback) {
		dispacherOfMaarivLanoar.unsubscribe(callback);
	}
	
	@Override
	public void sendMessage(String messege) {
		dispacherOfMaarivLanoar.notifySubscribers(messege);
	}

	@Override
	public int numberOfSubstrictions() {
		return dispacherOfMaarivLanoar.callbacks.size();
	}

	@Override
	public void stop() {
		dispacherOfMaarivLanoar.stop();
	}

}

class Blaizer implements Newspaper<String> {
	Dispatcher<String> dispacherOfBlaizer = new Dispatcher<>();
	
	@Override
	public int monthlyRate() {
		return 22;
	}

	@Override
	public DaysOfTheWeek dayOfDistribution() {
		return DaysOfTheWeek.SUNDAY;
	}

	@Override
	public void subscribe(Callback<String> callback) {
		dispacherOfBlaizer.subscribe(callback);
		
	}

	@Override
	public void unsubscribe(Callback<String> callback) {
		dispacherOfBlaizer.unsubscribe(callback);
		
	}
	
	@Override
	public void sendMessage(String messege) {
		dispacherOfBlaizer.notifySubscribers(messege);
	}

	@Override
	public int numberOfSubstrictions() {
		return dispacherOfBlaizer.callbacks.size();
	}

	@Override
	public void stop() {
		dispacherOfBlaizer.stop();
	}
}

class Adult implements Person {
	private String name;
	private Gender gender;
	private Callback<String> callback;
	private Consumer<String> update;
	private Worker stop;
	
	public Adult(String name, Gender gender) {
		this.name = name;
		this.gender = gender;
		update = i-> System.out.println("new mail to " + name + ": " + i);
		stop = ()-> System.out.println(name + ", the newspaper stopped to exsits, sorry");
		callback = new Callback<>(update, stop);
	}
	
	@Override
	public String getName() {
		return name;
	}

	@Override
	public Gender getGender() {
		return gender;
	}

	@Override
	public void register(Newspaper<String> newspaper) {
		newspaper.subscribe(callback);
	}

	@Override
	public void stopSubscription(Newspaper<String> newspaper) {
		newspaper.unsubscribe(callback);
	}
}

class Teenager implements Person {
	private String name;
	private Gender gender;
	private Consumer<String> update;
	private Worker stop;
	private Callback<String> callback;

	
	public Teenager(String name, Gender gender) {
		this.name = name;
		this.gender = gender;
		update = i-> System.out.println("new Whattsup to " + name + ": " + i);
		stop = ()-> System.out.println(name + ", the newspaper stopped to exsits, sorry");
		callback = new Callback<>(update, stop);
	}
	
	@Override
	public String getName() {
		return name;
	}

	@Override
	public Gender getGender() {
		return gender;
	}

	@Override
	public void register(Newspaper<String> newspaper) {
		newspaper.subscribe(callback);
	}

	@Override
	public void stopSubscription(Newspaper<String> newspaper) {
		newspaper.unsubscribe(callback);	
	}
}