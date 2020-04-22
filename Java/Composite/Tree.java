package composite;

import java.io.File;
import java.util.*;
import java.util.function.Function;

import factory.Factory;

public class Tree {
	private Branch branch;
	private List<FileSystemNode> nodeList;
	private String pathName;
	
	public Tree(String pathName) {
		this.pathName = pathName;
		branch = new Branch(pathName, 0);
		createTreeNode();
	}
	
	public void printTree() {
		File f = new File(pathName);
		System.out.println("\u001B[36m" + f.getName() + "\u001B[0m");
		
		for (FileSystemNode li : nodeList) {
			li.print();
		}
	}
	
	private void createTreeNode() {
		nodeList = branch.createNodeList(pathName);	
	}

	private interface FileSystemNode {
		void print();
	}

	private class Leaf implements FileSystemNode {
		private String pathName;
		private int level;
	
		public Leaf(String pathName, int level) {
			this.pathName = pathName;
			this.level = level;
		}
		
		public void print() {
			System.out.print("|");
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
		
		public Branch(String pathName, int level) {
			File file = new File(pathName);
			this.pathName = file.getName();
			this.level = ++level;
		}
		
		public void print() {
			System.out.print("|");
			for (int i = 0; i < level - 2; ++i) {
				System.out.print("--");
			}
			System.out.print("\u001B[36m" + pathName + "\u001B[0m");
			System.out.println("");
		}
		
		public List<FileSystemNode> createNodeList(String pathName) {
			File file = new File(pathName);
			File[] fileList = file.listFiles();
	
			for (File f : fileList) {				
				if (f.isDirectory()) {
					Branch curBranch = new Branch(f.getPath(), ++level);
					nodeList.add(curBranch);
					createNodeList(f.getPath());
				} else {
					Leaf curLeaf = new Leaf(f.getName(), level);
					nodeList.add(curLeaf);
				}
			}
			
			return nodeList;
		}
	}
}