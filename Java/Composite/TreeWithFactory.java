package composite;

import java.io.File;
import java.util.*;
import java.util.function.Function;

import factory.Factory;

public class TreeWithFactory {
	private Branch branch;
	private List<FileSystemNode> nodeList;
	private String pathName;
	private Factory<String, Object[], FileSystemNode> factory = new Factory<>();
	
	public TreeWithFactory(String pathName) {
		factory.add("Branch", (Object[] o)->new Branch((String)o[0], (Integer)o[1]).apply(o));
		factory.add("Leaf", (Object[] o)->new Leaf((String)o[0], (Integer)o[1]).apply(o));
		this.pathName = pathName;
		branch = new Branch(pathName);
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

	private interface FileSystemNode extends Function<Object, FileSystemNode>{
		void print();
	}

	private class Leaf implements FileSystemNode {
		private String pathName;
		private int level;
	
		public Leaf(String pathName, Integer level) {
			this.pathName = pathName;
			this.level = level.intValue() + 1;
		}
		
		public void print() {
			System.out.print("|");
			for (int i = 0; i < level; ++i) {
				System.out.print("--");
			}
			System.out.print("\u001B[34m" + pathName + "\u001B[0m");
			System.out.println("");
		}

		@Override
		public FileSystemNode apply(Object params) {
			Object[] objArray = (Object[]) params;
			return new Leaf((String)objArray[0], (Integer)objArray[1]);
		}
	}

	private class Branch implements FileSystemNode {	
		private String pathName; 
		private List<FileSystemNode> nodeList = new ArrayList<>();
		private int level;
		
		public Branch(String pathName, Integer level) {
			File file = new File(pathName);
			this.pathName = file.getName();
			this.level = level.intValue() + 1;
		}
		
		public Branch(String pathName) {
			File file = new File(pathName);
			this.pathName = file.getName();
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
					Object[] objArray = {f.getPath(), ++level};
					Branch curBranch = (Branch) factory.create("Branch", objArray);
					nodeList.add(curBranch);
					createNodeList(f.getPath());
				} else {
					Object[] objArray = {f.getPath(), ++level};
					Leaf curLeaf = (Leaf) factory.create("Leaf", objArray);
					nodeList.add(curLeaf);
				}
			}
			
			return nodeList;
		}

		@Override
		public FileSystemNode apply(Object params) {
			Object[] objArray = (Object[]) params;
			return new Leaf((String)objArray[0], (Integer)objArray[1]);
		}
	}
}