package factory;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class Tree {
	private Fileable root;
	private static Factory<Boolean, File, Fileable> factory = new Factory<>();
	private File file;
	
	public Tree(String path) throws FileNotFoundException {
		file = new File(path);
		
		factory.add(true, file -> {return new Directory(file);});
		factory.add(false, file -> {return new LeafFile(file);});
		
		if (!file.exists() || !file.isDirectory()) {
			throw new FileNotFoundException();
		}
		
		root = factory.create(true, file);
	}
	
	public void print() {
		root.print(0);
	}
	
	private class Directory implements Fileable {
		private List<Fileable> list = new ArrayList<>();
		private String nameOfDir;
		
		public Directory(File file) {
			nameOfDir = file.getName();
			File[] fileArray = file.listFiles();
			
			for (File f: fileArray) {
				list.add(factory.create(f.isDirectory(), f));
			}
		}

		@Override
		public void print(int height) {
			System.out.print(" " + nameOfDir + "\n");
			
			for (Fileable fileable: list) {
				printSpaces(height);
				System.out.print("└── ");
				fileable.print(height + 1);
			}
		}
	}
	
	private class LeafFile implements Fileable {
		private final String fileName;
		
		public LeafFile(File file) {
			fileName = file.getName();
		}

		@Override
		public void print(int height) {
			System.out.println(fileName);
		}		
	}
	
	private static void printSpaces(int numOfSpaces) {
		for (int i = 0; i < numOfSpaces; ++i) {
			System.out.print(" ");
		}
	}
	
	public static void main(String[] args) throws FileNotFoundException {
		Tree tree = new Tree("/home/moti/git/fs/");
		tree.print();
	}
}