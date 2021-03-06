import {BalancedTreeNode, TreeNode} from "./node";
import {compare} from "../util/compare";
import {UniIteratorImpl} from "../util/iterator";
import {Queue} from "./queue";

/*
 This is an implementation of the base functionality of a Binary Search Tree with Key/Value Pairs data structure.
 It implements:
     createEmpty()
     size()
     contains(..)
     get(..)
     put(..)
     remove(..)
     removeMin()
     removeMax()
     minKey()
     maxKey()
     floor(..)
     ceil(..)
     rank(..)
     selectKeyForRank(..)
     keys()
     iterator()
     keysInLevelOrder()
     height()
 */

export abstract class SearchTree<V>{

    protected root: TreeNode<V> | BalancedTreeNode<V>;
    protected shouldParseToFloat: boolean = undefined;

    constructor(){
        this.root = null;
    }

    isEmpty(): boolean{
        return this.size() === 0;
    }

    size(): number{
        return SearchTree.sizeOfNode(this.root);
    }

    contains(key: number | string): boolean{
        if( key === null || key === undefined ) throw new Error('argument to contains() is null');
        if( this.root !== null && (typeof key) !== (typeof this.root.key) ) throw new Error('key is of different type than root');
        return this.get(key) !== null;
    }

    get(key: number | string): V{
        return this.getFromNodeAtKey(this.root,key);
    }

    put(key: number | string, value: V){
        if(key === null || key === undefined) throw new Error("called put() with a null key");
        if( this.root !== null && (typeof key) !== (typeof this.root.key) ) throw new Error('key is of different type than root');

        if( this.shouldParseToFloat === undefined ) this.shouldParseToFloat = SearchTree.canParseToFloat(key);

        if(value === null) {
            this.remove(key);
            return;
        }
        this.root = this.putInNodeAtKey(this.root,key,value);
    }

    abstract remove(key: number | string);

    abstract removeMin();

    abstract removeMax();

    minKey(): number | string{
        if (this.isEmpty()) throw new Error("called min() with createEmpty tree");
        else return this.getMinNodeFrom(this.root).key;
    }

    maxKey(): number | string{
        if (this.isEmpty()) throw new Error("called max() with createEmpty tree");
        else return this.getMaxNodeFrom(this.root).key;
    }

    floor(key: number | string): number | string{
        if(key === null || key === undefined) throw new Error("argument to floor() is null");
        if(this.isEmpty()) throw new Error("called floor() with createEmpty tree");

        const floorNode = this.floorFromNodeToKey(this.root,key);

        return floorNode === null || floorNode === undefined ? null : floorNode.key;
    }

    ceil(key: number | string): number | string{
        if(key === null || key === undefined) throw new Error("Argument to floor() is null");
        if(this.isEmpty()) throw new Error("called ceil() with createEmpty tree");

        const ceilNode =  this.ceilFromNodeToKey(this.root,key);

        return ceilNode === null || ceilNode === undefined ? null : ceilNode.key;
    }

    rank(key: number | string): number{
        if (key === null || key === undefined) throw new Error("argument to rank() is null");
        if( !this.contains(key) ) throw new Error("key does not exist");
        return this.rankOfKeyFromNode(key, this.root);
    }

    selectKeyForRank(rank: number): string | number{
        if( rank < 0 || rank > this.size() - 1 || rank === null ) throw new Error("called selectKeyForRank() with invalid argument");
        return this.nodeAtRankFromNode(rank, this.root).key;
    }

    keys(): (number | string)[]{
        return this.getKeysInRange( this.minKey(), this.maxKey() );
    }

    iterator(): UniIteratorImpl<TreeNode<V>>{
        return this.getNodesInRange(this.minKey(), this.maxKey());
    }

    keysInLevelOrder(): (number | string)[]{

        let keys: Queue<number | string> = new Queue<number | string>();
        let nodes: Queue<TreeNode<V>> = new Queue<TreeNode<V>>();

        nodes.enqueue(this.root);

        while( !nodes.isEmpty() ){
            let currentNode = nodes.dequeue();

            if(currentNode === null || currentNode === undefined) continue;

            keys.enqueue( currentNode.key );
            nodes.enqueue( currentNode.left );
            nodes.enqueue( currentNode.right );
        }

        return keys.iterator().list();
    }

    height(): number{
        return this.heightFromNode( this.root );
    }

    //private / protected functions

    protected static sizeOfNode<V>(node: TreeNode<V> | BalancedTreeNode<V>): number{
        if(node === null || node === undefined) return 0;
        return node.size;
    }

    protected abstract getFromNodeAtKey(node: TreeNode<V> | BalancedTreeNode<V>, key: number | string): V;

    protected abstract putInNodeAtKey(node: TreeNode<V> | BalancedTreeNode<V>, key: number | string, value: V) : TreeNode<V> | BalancedTreeNode<V>;

    protected abstract removeInNodeAtKey(node: TreeNode<V> | BalancedTreeNode<V>, key: number | string): TreeNode<V> | BalancedTreeNode<V>

    protected abstract removeMinNodeFrom(node: TreeNode<V> | BalancedTreeNode<V>): TreeNode<V> | BalancedTreeNode<V>;

    protected abstract removeMaxNodeFrom(node: TreeNode<V> | BalancedTreeNode<V>): TreeNode<V> | BalancedTreeNode<V>;

    protected getMinNodeFrom(node: TreeNode<V> | BalancedTreeNode<V>): TreeNode<V> | BalancedTreeNode<V>{
        if( node === null || node === undefined ) throw new Error("called getMinNodeFrom(..) with a null key");

        if(node.left === null) return node;
        else return this.getMinNodeFrom(node.left);
    }

    protected getMaxNodeFrom(node: TreeNode<V> | BalancedTreeNode<V>): TreeNode<V> | BalancedTreeNode<V>{
        if( node === null || node === undefined ) throw new Error("called getMaxNodeFrom(..) with a null key");

        if(node.right === null) return node;
        else return this.getMaxNodeFrom(node.right);
    }

    protected floorFromNodeToKey(node: TreeNode<V> | BalancedTreeNode<V>, key: number | string): TreeNode<V> | BalancedTreeNode<V>{
        if(node === null || node === undefined) return null;

        let _compare = !this.shouldParseToFloat ? compare(key,node.key) : compare(SearchTree.parseFloat(key),SearchTree.parseFloat(node.key));

        if( _compare === 0 ) return node;
        if( _compare < 0 ) return this.floorFromNodeToKey(node.left, key);

        let potentialFloorNode = this.floorFromNodeToKey(node.right,key);
        if(potentialFloorNode !== null) return potentialFloorNode;

        return node;
    }

    protected ceilFromNodeToKey(node: TreeNode<V> | BalancedTreeNode<V>, key: number | string): TreeNode<V> | BalancedTreeNode<V>{
        if(node === null || node === undefined) return null;

        let _compare = !this.shouldParseToFloat ? compare(key,node.key) : compare(SearchTree.parseFloat(key),SearchTree.parseFloat(node.key));

        if( _compare === 0 ) return node;
        if( _compare > 0 ) return this.ceilFromNodeToKey(node.right, key);

        let potentialCeilNode = this.ceilFromNodeToKey(node.left,key);
        if(potentialCeilNode !== null) return potentialCeilNode;

        return node;
    }

    protected rankOfKeyFromNode(key: number | string, node: TreeNode<V> | BalancedTreeNode<V>): number {
        if(node === null || node === undefined) return 0;

        let _compare = !this.shouldParseToFloat ? compare(key,node.key) : compare(SearchTree.parseFloat(key),SearchTree.parseFloat(node.key));

        if( _compare < 0 ) return this.rankOfKeyFromNode(key, node.left);
        else if( _compare > 0 ) return 1 + SearchTree.sizeOfNode(node.left) + this.rankOfKeyFromNode(key, node.right);
        else return SearchTree.sizeOfNode(node.left);
    }

    protected nodeAtRankFromNode(rank: number, node: TreeNode<V> | BalancedTreeNode<V>): TreeNode<V> | BalancedTreeNode<V>{
        if(node === null || node === undefined) return null;
        let leftSize = SearchTree.sizeOfNode(node.left);

        if( leftSize < rank ) return this.nodeAtRankFromNode(rank - leftSize - 1, node.right);
        else if( leftSize > rank ) return this.nodeAtRankFromNode(rank, node.left);
        else return node;
    }

    protected getKeysInRange(from: number | string, to: number | string): (number | string)[]{
        if(from === null || from === undefined ) throw new Error("first argument to getKeysInRange() is null");
        if(to === null || to === undefined ) throw new Error("second argument to getKeysInRange() is null");

        let queue: Queue<number | string> = new Queue<number | string>();

        this.addKeysToQueue(this.root, queue, from, to);

        return queue.iterator().list();
    }

    protected addKeysToQueue(node: TreeNode<V>, queue: Queue<number | string>, lo: number | string, hi: number | string ): void{
        if(node === null || node === undefined) return;

        let _comparelo = !this.shouldParseToFloat ? compare(lo,node.key) : compare(SearchTree.parseFloat(lo),SearchTree.parseFloat(node.key));
        let _comparehi = !this.shouldParseToFloat ? compare(hi,node.key) : compare(SearchTree.parseFloat(hi),SearchTree.parseFloat(node.key));

        if( _comparelo < 0 ) this.addKeysToQueue(node.left, queue, lo, hi);
        if( _comparelo <= 0 && _comparehi >= 0 ) queue.enqueue(node.key);
        if( _comparehi > 0 ) this.addKeysToQueue(node.right, queue, lo, hi);
    }

    protected getNodesInRange(from: number | string, to: number | string): UniIteratorImpl<TreeNode<V>>{
        if( from === null || from === undefined) throw new Error("first argument to getNodesInRange() is null");
        if( to === null || to === undefined) throw new Error("second argument to getNodesInRange() is null");

        let queue: Queue<TreeNode<V>> = new Queue<TreeNode<V>>();

        this.addNodesToQueue(this.root, queue, from, to);

        return queue.iterator();
    }

    protected addNodesToQueue(node: TreeNode<V>, queue: Queue<TreeNode<V>>, lo: number | string, hi: number | string ): void{
        if(node === null || node === undefined) return;

        let _comparelo = !this.shouldParseToFloat ? compare(lo,node.key) : compare(SearchTree.parseFloat(lo),SearchTree.parseFloat(node.key));
        let _comparehi = !this.shouldParseToFloat ? compare(hi,node.key) : compare(SearchTree.parseFloat(hi),SearchTree.parseFloat(node.key));

        if( _comparelo < 0 ) this.addNodesToQueue(node.left, queue, lo, hi);
        if( _comparelo <= 0 && _comparehi >= 0) queue.enqueue(node);
        if( _comparehi > 0 ) this.addNodesToQueue(node.right, queue, lo, hi);
    }

    protected heightFromNode(node: TreeNode<V> | BalancedTreeNode<V>): number{
        if(node === null || node === undefined) return -1;
        return 1 + Math.max( this.heightFromNode(node.left), this.heightFromNode(node.right) );
    }

    protected static canParseToFloat(key: number | string): boolean{
        return  typeof key === 'string' && !isNaN(parseFloat(key));
    }

    protected static parseFloat(key: number | string): number{
        if( !this.canParseToFloat(key) ) throw Error('cannot parse the string');
        return parseFloat(key.toString());
    }

}