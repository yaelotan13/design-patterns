package composite;

import java.io.FileNotFoundException;

public class MainForFactory {
	public static void main(String[] args) throws FileNotFoundException {
		TreeFactory tree = new TreeFactory("/home/student1/yael-lotan/fs/projects/src/il/co/ilrd/enums");
		tree.printTree();
	}
}
