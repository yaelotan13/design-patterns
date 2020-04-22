package composite;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.function.Function;

import factory.Factory;

public class TreeFactory {
	private FileSystemNode root;
	private File file;
	private Factory<String, File, FileSystemNode> factory = new Factory<>();
	
	public TreeFactory(String pathName) throws FileNotFoundException {
		file = new File(pathName);
		
		if (!file.isDirectory()) {
			throw new FileNotFoundException();
		}
		
		factory.add("Branch", file -> {return new Branch(file);});
		factory.add("Leaf", file -> {return new Leaf(file);});
		
		root = factory.create("Branch", file);
	}
	
	public void printTree() {
		root.print(0);
	}
	
	private interface FileSystemNode {
		void print(int level);
	}

	private class Leaf implements FileSystemNode {
		private String pathName;
		private int level;
	
		public Leaf(File file) {
			this.pathName = file.getName();
		}
		
		public void print(int level) {
			for (int i = 0; i < level; ++i) {
				System.out.print("--");
			}
			System.out.print("\u001B[34m" + pathName + "\u001B[0m");
			System.out.println("");
		}
	}

	private class Branch implements FileSystemNode {	
		private String pathName; 
		private List<FileSystemNode> nodeList = new ArrayList<>();
		private int level;
		
		public Branch(File file) {
			pathName = file.getName();
			File[] fileArray = file.listFiles();
			
			for (File f : fileArray) {
				nodeList.add(factory.create(f.isDirectory() ? "Branch" : "Leaf", f));
			}
		}
		
		@Override
		public void print(int level) {
			for (FileSystemNode file: nodeList) {
				for (int i = 0; i < level; ++i) {
					System.out.print("--");
				}
				file.print(level + 1);
			}
		}
	}
}