package factory;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.*;

import java.util.function.Function;

import org.junit.jupiter.api.Test;

class TestFactory {
	
	interface Shape extends Function<String, String>{
		String draw(String s);
	}
	
	interface Humam extends Function<Object, Object>{
		void sayHello();
	}
	
	interface Legs {
		Integer getNumLegs();
	}
	
	interface Animal {
		Animal getAnimal();
	}
	
	class Women implements Humam {

		@Override
		public Object apply(Object t) {
			sayHello();
			return null;
		}

		@Override
		public void sayHello() {
			System.out.println("Hello from a women");
			
		}
		
	}
	class Monkey implements Animal {

		@Override
		public Animal getAnimal() {
			System.out.println("I am a new monkey!");
			return new Monkey();
		}
	}
	
	class Elephent implements Legs {
		private int numLegs = 4;
		
		@Override
		public Integer getNumLegs() {
			return numLegs;
		}
	}
	
	static class Squar implements Shape {

		@Override
		public String apply(String s) {
			return draw(s);
		}

		public static String drawSomething(String s) {
			return "Squar is drawing in " + s;
		}
		
		@Override
		public String draw(String s) {
			return "Squar is drawing in " + s;
		}
		
	}
	class Circle implements Shape {	
		public Circle() {
		}
		
		@Override
		public String draw(String s) {
			return "Circle is drawing in " + s;
		}

		@Override
		public String apply(String s) {
			return draw(s);
		}
	}
	
	class Rectengle implements Shape {
		public Rectengle() {
		}
		
		@Override
		public String draw(String s) {
			return "Rectengle is drawing in " + s;
		}

		@Override
		public String apply(String s) {
			return draw(s);
		}
	}
	
	@Test
	void testLambdaExpression() {
		Factory<String, String, String> factory = new Factory<>();
		factory.add("Circle", (String s)->new Circle().apply(s));
		assertEquals(factory.create("Circle", "pink"), "Circle is drawing in pink");
	}
	
	@Test
	void testLambdaExpressionCreateWithNoArgs() {
		Factory<String, Object, Object> factory = new Factory<>();
		factory.add("Women", (Object o)->new Women().apply(o));
	}
	
	@Test
	void testAnonymousClass() {
		Factory<String, String, String> factory = new Factory<>();
		factory.add("Rectengle", new Function<String, String>() {
			
			@Override
			public String apply(String s) {
				return new Rectengle().draw(s);
			}
		});
		
		assertEquals(factory.create("Rectengle", "green"), "Rectengle is drawing in green");
	}
	
	@Test
	void testStaticMethod() {
		Factory<String, String, String> factory = new Factory<>();
		factory.add("Squar", Squar::drawSomething);
		
		assertEquals(factory.create("Squar", "yellow"), "Squar is drawing in yellow");
	}
	
	@Test
	void testInstanceMethodThroughAnObject() {
		Factory<String, String, String> factory = new Factory<>();
		Shape circle = new Circle();
		
		factory.add("Circle", circle::draw);
		
		assertEquals(factory.create("Circle", "red"), "Circle is drawing in red");
	}
	
	@Test
	void testInstanceMethodWithoutAnObject() {
		Function<Legs, Integer> f = Legs::getNumLegs;
		Legs elephent = new Elephent();
		
		assertEquals(4, f.apply(elephent));
	}
	
	@Test
	void testInstanceMethodWithoutAnObjectWithFactory() {
		Factory<String, Animal, Animal> factory = new Factory<>();
		Animal monkey = new Monkey();
		
		factory.add("monkey", Animal::getAnimal);
		factory.create("monkey", monkey);
	}
}