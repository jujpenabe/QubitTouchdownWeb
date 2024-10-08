class Node{
    constructor(type){
        this.type = type;
        this.links = [];
        this.keys = new Map();
    }
    
    SetLinks(node1,link1,node2,link2,node3,link3){
        this.links.push(node1);
        this.links.push(node2);
        this.links.push(node3);

        this.keys.set(link1,0);
        this.keys.set(link2,1);
        this.keys.set(link3,2);
    }
    
   /*
    SetLinks(node1,link1){
        this.links.push(node1);
        this.keys.set(link1,0);
    }
    */

    GetNode(cardType){
        let nodeRef;
        let tmp = this.keys.get(cardType);
        if (tmp != undefined){
            nodeRef = this.links[tmp];
        }
        return nodeRef;
    }
}