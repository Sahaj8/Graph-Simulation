// Declare all global variables here
	var curr_x;
	var curr_y;
	var timeStep;
	var e;
	var u;
	var move_id;

	var key_node;
	var key_edge;
	var key_dfs;
	var key_bfs;
	var key_del;
	var key_sh_path;
	var key_undir;

	var dfs_node;
	var bfs_node;

	var n_nodes;
	var radius;

	var nodes;
	var edge_mat;
	var color_node;
	var color_edge;
	var stack;
	var queue;
	var prev;
	var dist;
	var prior_queue;
	var sh_path;

	function setup() {
	    // Initialize variables here
		nodes = [];
		edge_mat = [];
		color_node = [];
		color_edge = [];
		stack = [];
		queue = [];
		prev = [];
		dist = [];
		prior_queue = [];
		sh_path = [];

		key_node = 0;
		key_edge = 0;
		key_dfs = 0;
		key_bfs = 0;
		key_dij = 0;
		key_del = 0;
		key_sh_path = 0;
		key_undir = 1;

		dfs_node = 0;
		bfs_node = 0;
		dij_node = 0;

		n_nodes = 0;
		radius = 20;
		timeStep = 50;
		e = 0;
		u = -1;
		move_id = -1;
	}

	class Node {
		constructor(x,y,id)
		{
			this.x = x;
			this.y = y;
			this.id = id;
		}
	}

	function change_key_d_edge() {
		key_undir = 0;
	}

	function change_key_ud_edge() {
		key_undir = 1;
	}

	function change_key_node() {
		reset_keys();
		key_node = 1;
	}

	function change_key_edge() {
		reset_keys();
		key_edge = 1;
	}

	function change_key_dfs() {
		reset_all();
		dfs_node = 1;
	}

	function change_key_bfs() {
		reset_all();
		bfs_node = 1;
	}

	function change_key_dij() {
		reset_all();
		dij_node = 1;
	}

	function change_key_del() {
		reset_all();
		key_del = 1;
	}

	function change_key_sh_path() {
		reset_all();
		key_sh_path = 1;
	}

	function reset_all() {
		reset_keys();
		reset_nodes();
		reset_edges();
	}

	function reset_keys() {
		key_node = 0;
		key_edge = 0;
		key_dfs = 0;
		dfs_node = 0;
		stack = [];
		key_bfs = 0;
		bfs_node = 0;
		queue = [];
		key_dij = 0;
		dij_node = 0;
		prev = [];
		dist = [];
		e = 0;
		u = -1;
		key_del = 0;
		key_sh_path = 0;
		sh_path = [];
	}

	function add_node() {
		if(key_node && (check_node(canvas.mouseDownX,canvas.mouseDownY) == -1)) {
			node = new Node(canvas.mouseDownX,canvas.mouseDownY,n_nodes);
			nodes.push(node);

			for(var i=0;i<n_nodes;i++) {
				edge_mat[i].push(0);
				color_edge[i].push(0);
			}

			edge_mat.push([]);
			color_edge.push([]);
			for(var i=0;i<n_nodes+1;i++) {
				edge_mat[n_nodes].push(0);
				color_edge[n_nodes].push(0);
			}
			n_nodes++;
			color_node.push(0);

			for(var i=0;i<n_nodes;i++){
			console.log(edge_mat[i]);}
		}
	}

	function add_edge() {
		var list = check_edge(canvas.mouseDownX,canvas.mouseDownY,canvas.mouseUpX,canvas.mouseUpY);
		if(key_edge && list[0]) {
			id1 = list[1];
			id2 = list[2];
			edge_mat[id1][id2] = 1;
			if(key_undir)
				edge_mat[id2][id1] = 1;
			// color_edge.push(0);

			for(var i=0;i<n_nodes;i++){
			console.log(edge_mat[i]);}
		}
	}

	function nodes_render() {
		for(var i=0;i<nodes.length;i++) {
			if(color_node[i] == 0)
				canvas.setColor("red");
			else if(color_node[i] == 1)
				canvas.setColor("yellow");
			else
				canvas.setColor("green");
			canvas.drawCircle(nodes[i].x , nodes[i].y , radius);
		}
	}

	function edge_render() {
		for(var i=0;i<nodes.length;i++) {
			for(var j=0;j<nodes.length;j++) {
				if(edge_mat[i][j] == 1) {
					if(color_edge[i][j] == 0)
						canvas.setColor("blue");
					else if(color_edge[i][j] == 1)
						canvas.setColor("yellow");
					else
						canvas.setColor("red");
					canvas.setDrawMode("stroke");
					canvas.drawLine(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
					if(key_del) {
						canvas.drawCircle((nodes[i].x+nodes[j].x)/2 , (nodes[i].y+nodes[j].y)/2 , 10);
					}
				}
			}
		}
	}

	function check_node(x1,y1) {
		for(var i=0;i<nodes.length;i++) {
			if(Math.pow(x1 - nodes[i].x , 2) + Math.pow(y1 - nodes[i].y, 2) <= Math.pow(radius*2, 2))
				return nodes[i].id;
		}
		return -1;
	}

	function check_edge_ball(x1,y1) {
		for(var i=0;i<edge_mat.length;i++) {
			for(var j=0;j<edge_mat.length;j++) {
				if(edge_mat[i][j] == 1) {
					if(Math.pow(x1 - ((nodes[i].x+nodes[j].x)/2),2) + Math.pow(y1 - ((nodes[i].y+nodes[j].y)/2),2) <= Math.pow(10,2)) {
						edge_mat[i][j] = 0;
						if(key_undir)
							edge_mat[j][i] = 0;
						return;
					}
				}
			}
		}
	}

	function check_edge(x1,y1,x2,y2) {
		var l = [];
		var id1 = -1;
		var id2 = -1;
		for(var i=0;i<nodes.length;i++) {
			if(Math.pow(x1 - nodes[i].x , 2) + Math.pow(y1 - nodes[i].y, 2) <= Math.pow(radius, 2))
				id1 = nodes[i].id;
			if(Math.pow(x2 - nodes[i].x , 2) + Math.pow(y2 - nodes[i].y, 2) <= Math.pow(radius, 2))
				id2 = nodes[i].id;
		}
		if(id1!=-1 && id2!=-1 && id1!=id2) {
			l.push(1);
			l.push(id1);
			l.push(id2);
		}
		else
			l.push(0);
		return l;
	}

	function reset_nodes() {
		for(var i=0;i<color_node.length;i++) {
			color_node[i]=0;
		}
	}

	function reset_edges() {
		for(var i=0;i<nodes.length;i++) {
			for(var j=0;j<nodes.length;j++) {
				color_edge[i][j] = 0;
			}
		}
	}

	function check_color_node() {
		for(var i=0;i<color_node.length;i++) {
			if(color_node[i]!=2)
				return;
		}
		reset_keys();
	}

	// Declare custom functions here
	// Function while will be called repeatedly 
	function main() {
		canvas.clear();
		canvas.setDrawMode("fill");
		nodes_render();
		edge_render();
		if(key_dfs) {
			apply_dfs();
		}
		if(key_bfs) {
			apply_bfs();
		}
		if(key_dij) {
			apply_dij();
		}
		if(move_id != -1) {
			nodes[move_id].x = canvas.mouseX;
			nodes[move_id].y = canvas.mouseY;
		}
	}

	// Override functions here;

	canvas.mouseDownCallback = function () {
		if(key_edge == 0) {
			move_id = check_node(canvas.mouseDownX,canvas.mouseDownY);
		}
	}

	canvas.mouseUpCallback = function () {
		if((canvas.mouseDownX == canvas.mouseUpX) && (canvas.mouseDownY == canvas.mouseUpY))
		{
			if(key_node && canvas.mouseDownY>100)
				add_node();
			else if(key_del) {
				i_d = check_node(canvas.mouseDownX,canvas.mouseDownY);
				if(i_d != -1) {
					del_node(i_d);
				}
				check_edge_ball(canvas.mouseDownX,canvas.mouseDownY);
			}
			else if(dfs_node) {
				i_d = check_node(canvas.mouseDownX,canvas.mouseDownY);
				if(i_d != -1) {
					stack.push(i_d);
					key_dfs = 1;
					dfs_node = 0;
				}
			}
			else if(bfs_node) {
				i_d = check_node(canvas.mouseDownX,canvas.mouseDownY);
				if(i_d != -1) {
					queue.push(i_d);
					key_bfs = 1;
					bfs_node = 0;
				}
			}
			else if(dij_node) {
				i_d = check_node(canvas.mouseDownX,canvas.mouseDownY);
				if(i_d != -1) {
					// prior_queue.push([i_d,dist[i_d]]);
					for(var i=0;i<nodes.length;i++) {
						dist.push(1000);
						prev.push(i);
						prior_queue.push([i,dist[i]]);
					}
					dist[i_d] = 0;
					prior_queue[i_d][1] = 0;
					console.log(prior_queue[0]);
					key_dij = 1;
					dij_node = 0;
				}
			}
			else if(key_sh_path) {
				i_d = check_node(canvas.mouseDownX,canvas.mouseDownY);
				if(sh_path.length == 0)
					sh_path.push(i_d);
				else if(sh_path.length == 1 && i_d != sh_path[0]) {
					sh_path.push(i_d);
					for(var i=0;i<nodes.length;i++) {
						dist.push(1000);
						prev.push(i);
						prior_queue.push([i,dist[i]]);
					}
					dist[sh_path[0]] = 0;
					prior_queue[sh_path[0]][1] = 0;
					find_sh_path(sh_path);
					key_sh_path = 0;
				}
			}
		}
		else if(key_edge)
			add_edge();
		move_id = -1;
	}

	canvas.mainFunction = main;
	// var timeStep = step;
	canvas.startMain(timeStep);
	canvas.setupFunction = setup;

	document.getElementById('add_node').addEventListener("click", change_key_node);
	document.getElementById('add_edge').addEventListener("click", change_key_edge);
	document.getElementById('d_edge').addEventListener("click", change_key_d_edge);
	document.getElementById('ud_edge').addEventListener("click", change_key_ud_edge);
	document.getElementById('dfs').addEventListener("click", change_key_dfs);
	document.getElementById('bfs').addEventListener("click", change_key_bfs);
	document.getElementById('dij').addEventListener("click", change_key_dij);
	document.getElementById('sh_path').addEventListener("click", change_key_sh_path);
	document.getElementById('reset').addEventListener("click", reset);
	document.getElementById('del').addEventListener("click", change_key_del);
	document.getElementById('clear').addEventListener("click", clear);

	function reset() {
		reset_all();
	}

	function clear() {
		n_nodes = 0;
		nodes = [];
		edge_mat = [];
		color_node = [];
		color_edge = [];
		reset_all();
	}

	function apply_dfs() {
		sleep(950);
		console.log(prior_queue);
		check_color_node();
		if(key_dfs == 0)
			return;

		var i=stack.pop();
		if(color_node[i] != 2) {
			color_node[i]=2;
			for(var j=0;j<nodes.length;j++) {
				if(edge_mat[i][j] == 1 && color_node[j]!=2) {
					stack.push(j);
					color_node[j] = 1;
				}
			}			
		}

		if(stack.length == 0) {
			for(var j=0;j<nodes.length;j++) {
				if(color_node[j] == 0) {
					stack.push(j);
					break;
				}
			}
		}
	}

	function apply_bfs() {
		sleep(950);
		check_color_node();
		if(key_bfs == 0)
			return;

		var i=queue.shift();
		if(color_node[i] != 2) {
			color_node[i]=2;
			for(var j=0;j<nodes.length;j++) {
				if(edge_mat[i][j] == 1 && color_node[j]!=2) {
					queue.push(j);
					color_node[j] = 1;
				}
			}			
		}

		if(queue.length == 0) {
			for(var j=0;j<nodes.length;j++) {
				if(color_node[j] == 0) {
					queue.push(j);
					break;
				}
			}
		}
	}

	function apply_dij() {
		if(prior_queue.length == 0) {
			var k = -1;
			for(var i=0;i<color_edge.length;i++) {
				for(var j=0;j<color_edge.length;j++) {
					if(color_edge[i][j] == 1) {
						console.log("yel");
						color_edge[i][j] = 2;
						if(key_undir)
							color_edge[j][i] = 2;
						k=1;
						break;
					}
				}
				if(k == 1)
					break;
				sleep(500);
			}
			if(k == -1)
				key_dij = 0;
			return;
		}
		if(e == 0) {
			sort_dist();
			u = (prior_queue.pop())[0];
			if(key_undir)
				color_edge[u][prev[u]] = 2;
			color_edge[prev[u]][u] = 2;
			e = -1;
			// sleep(1000);
		}
		else {
			if(e == -1)
				e = 0;
			if(edge_mat[u][e] == 1 && check_prior_queue(e)) {
				if(dist[u] + 1 < dist[e]) {
					dist[e] = dist[u] + 1;
					prev[e] = u;
					dec_prior(e,dist[u]+1);
				}
				color_edge[u][e] = 1;
				if(key_undir)
					color_edge[e][u] = 1;
				console.log("inside");
			}
			e=(e+1)%nodes.length;
			sleep(500);
		}
	}

	function sort_dist() {
		for(var i=0;i<prior_queue.length;i++) {
			for(var j=0;j<prior_queue.length-1;j++) {
				if(prior_queue[j][1] < prior_queue[j+1][1]) {
					var t = prior_queue[j];
					prior_queue[j] = prior_queue[j+1];
					prior_queue[j+1] = t;
				}
			}
		}
	}

	function dec_prior(v,d) {
		for(var i=0;i<prior_queue.length;i++) {
			if(prior_queue[i][0] == v) {
				prior_queue[i][1] = d;
				break;
			}
		}
	}

	function check_prior_queue(v) {
		for(var i=0;i<prior_queue.length;i++) {
			if(prior_queue[i][0] == v)
				return 1;
		}
		return 0;
	}

	function find_sh_path(l) {
		console.log(l);
		while(prior_queue.length != 0) {
			sort_dist();
			u = (prior_queue.pop())[0];
			for(var i=0;i<nodes.length;i++) {
				if(edge_mat[u][i] == 1 && check_prior_queue(i)) {
					if(dist[u] + 1 < dist[i]) {
						dist[i] = dist[u] + 1;
						prev[i] = u;
						dec_prior(i,dist[u]+1);
					}
				}
			}
		}
		var j = l[1];
		while(j != prev[j]) {
			if(key_undir)
				color_edge[j][prev[j]] = 1;
			color_edge[prev[j]][j] = 1;
			j = prev[j];
		}
	}

	function del_node(i_d) {
		n_nodes--;
		nodes.splice(i_d,1);
		color_node.splice(i_d,1);
		for(var i=i_d;i<nodes.length;i++) {
			nodes[i].id--;
		}
		for(var i=0;i<edge_mat.length;i++) {
			edge_mat[i].splice(i_d,1);
			color_edge[i].splice(i_d,1);
		}
		edge_mat.splice(i_d,1);
		color_edge.splice(i_d,1);
		// console.log(color_node);
	}

	function sleep(milliseconds) {
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
	    if ((new Date().getTime() - start) > milliseconds){
	      break;
	    }
	  }
	}
