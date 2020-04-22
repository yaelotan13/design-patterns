package observer;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class ObserverTest {

	@Test
	void testSubscribe() {
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
			
		assertEquals(1, laisha.numberOfSubstrictions());
		assertEquals(2, maarivLanoar.numberOfSubstrictions());
		assertEquals(1, blaizer.numberOfSubstrictions());
	}

	@Test
	void testMessages() {
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
			
		laisha.sendMessage("Hola beautiful Lahisha redear, you will get me every " + laisha.dayOfDistribution());
		maarivLanoar.sendMessage("HEY you cool MaarivLanoar readers, you will get me every " + maarivLanoar.dayOfDistribution());
		blaizer.sendMessage("Yoo dude from Blaizer, you will get me every " + blaizer.dayOfDistribution());
	}
	
	@Test
	void testStop() {
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
			
		laisha.stop();
		maarivLanoar.stop();
		blaizer.stop();
		
		assertEquals(0, laisha.numberOfSubstrictions());
		assertEquals(0, maarivLanoar.numberOfSubstrictions());
		assertEquals(0, blaizer.numberOfSubstrictions());
	}
	
	@Test
	void testUnsubscribe() {
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
			
		yael.stopSubscription(laisha);
		jeda.stopSubscription(maarivLanoar);
		hadar.stopSubscription(blaizer);
		albi.stopSubscription(maarivLanoar);
		
		assertEquals(0, laisha.numberOfSubstrictions());
		assertEquals(0, maarivLanoar.numberOfSubstrictions());
		assertEquals(0, blaizer.numberOfSubstrictions());
	}
}
