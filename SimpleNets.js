class SimpleNets {
	
	constructor(nodes = [], edges = [], delta = 0.99, cost = 1.4) {
		this.edges = edges;
		this.nodes = nodes;
		this.uDelta = delta;
		this.uCost = cost;
	}
  
	erdos(n,p) {
	  console.log('ER graph generator - '+ n +' nodes');
	  this.nodes = [];
	  this.edges = [];
	  for (var i=0;i<n;i++) {
		this.nodes.push(i);
			for (var j=0;j<n;j++) {
			if (i != j) {
				var coin = Math.random();
				if (coin <= p) {
					this.edges.push([i,j]);
					this.edges.push([j,i]);
					}
				}
			}
		}	
		return this;	
	}
	
	erdosSteps(n,p) {
	  console.log('ER graph generator - '+ n +' nodes, probability ' + p);
	  var configurations = new Array();
	  this.nodes = [];
	  this.edges = [];
	  for (var i=0;i<n;i++) {
		  this.nodes.push(i);
	  }
	  
	  for (var i=0;i<n;i++) {
			for (var j=0;j<n;j++) {
			if (i != j) {
				var coin = Math.random();
				if (coin <= p) {
					this.edges.push([i,j]);
					this.edges.push([j,i]);
					var c = new SimpleNets();
					c.nodes = Object.assign(c.nodes,this.nodes);
					c.edges = Object.assign(c.edges,this.edges);
					configurations.push(c);
					}
				}
			}
		}	
	
		return configurations;	
	}
	
	wattsStrogatz(n,k,b) {
		//generate a ring with n nodes,k degree, beta rewiring parameter
		console.log('WS graph generator');
		this.nodes = [];
		this.edges = [];
		//generate lattice...
		for (var i=0;i<n;i++) {
		this.nodes.push(i);
		for (var j=0;j<n;j++) {
			if (i != j) {
				var check = (Math.abs(i-j) % (n-k/2) >= 0) && (Math.abs(i-j) % (n-k/2) <= k/2);
				if (check)
					this.edges.push([i,j]);
				}
			}
		}	
		// ...and rewire with probability b
		for (var j=0;j<this.edges.length;j++) {
			var e = this.edges[j];
			var check = (e[1] > e[0]) && (e[1]<=e[0]+k/2);
			if (check) {
			var coin = Math.random();
				if (coin <= b) {
				// ...choose new k
				var nj = Math.floor(Math.random(0,n-1)*10);
				// ...avoid self-loop and link duplication
				if (nj != e[0] && !this.edges.includes([e[0],nj])) {
						e[1] = nj;
					}
				}
			}	
		}
		return this;
	}
	
	wattsStrogatzSteps(n,k,b) {
		//generate a ring with n nodes,k degree, beta rewiring parameter
		console.log('WS graph generator - '+ n +' nodes, degree ' + k + ',b '+b);
		var configurations = new Array();
		this.nodes = [];
		this.edges = [];
		for (var i=0;i<n;i++) {
		  this.nodes.push(i);
		}
		//generate lattice...
		for (var i=0;i<n;i++) {
		for (var j=0;j<n;j++) {
			if (i != j) {
				var check = (Math.abs(i-j) % (n-k/2) >= 0) && (Math.abs(i-j) % (n-k/2) <= k/2);
				if (check) {
					this.edges.push([i,j]);
					var c = new SimpleNets();
					c.nodes = Object.assign(c.nodes,this.nodes);
					c.edges = Object.assign(c.edges,this.edges);
					configurations.push(c);		
				}
				}
			}
		}	
		// ...and rewire with probability b
		for (var j=0;j<this.edges.length;j++) {
			var e = this.edges[j];
			var check = (e[1] > e[0]) && (e[1]<=e[0]+k/2);
			if (check) {
			var coin = Math.random();
				if (coin <= b) {
				// ...choose new k
				var nj = Math.floor(Math.random(0,n-1)*10);
				// ...avoid self-loop and link duplication
				if (nj != e[0] && !this.edges.includes([e[0],nj])) {
						e[1] = nj;
						var c = new SimpleNets();
						c.nodes = Object.assign(c.nodes,this.nodes);
						c.edges = Object.assign(c.edges,this.edges);
						configurations.push(c);		
					}
				}
			}
				
		}
		return configurations;
	}
	
	
	lattice(n,k) {
		console.log('Lattice graph generator');
		this.nodes = [];
		this.edges = [];
		//generate lattice...
		for (var i=0;i<n;i++) {
		this.nodes.push(i);
		for (var j=0;j<n;j++) {
			if (i != j) {
				var check = (Math.abs(i-j) % (n-k/2) >= 0) && (Math.abs(i-j) % (n-k/2) <= k/2);
				if (check)
					this.edges.push([i,j]);
				}
			}
		}	
	return this;
	}
	
	latticeSteps(n,k) {
		console.log('Lattice graph generator');
		var configurations = new Array();
		this.nodes = [];
		this.edges = [];
		for (var i=0;i<n;i++) {
		  this.nodes.push(i);
		}
		//generate lattice...
		for (var i=0;i<n;i++) {
		this.nodes.push(i);
		for (var j=0;j<n;j++) {
			if (i != j) {
				var check = (Math.abs(i-j) % (n-k/2) >= 0) && (Math.abs(i-j) % (n-k/2) <= k/2);
				if (check) {
					this.edges.push([i,j]);
					var c = new SimpleNets();
					c.nodes = Object.assign(c.nodes,this.nodes);
					c.edges = Object.assign(c.edges,this.edges);
					configurations.push(c);		
				}
				}
			}
		}	
	return configurations;
	}
	
	barabasiAlbert(n,d) {
		//d, duration steps
		console.log('Barabasi-Albert graph generator');
		this.nodes = [];
		this.edges = [];
		var pe = 1;
		var arrGraph = [];
		var eg = new SimpleNets();

		var startGraph = eg.lattice(n,2);
		arrGraph[0] = startGraph;

		var t = 1;
		while (t<=d) {
			//try to add node and link
			var degrees = startGraph.degrees();
			var degreesSum = degrees.reduce(function(a, b) {
			  return a + b;
			}, 0);
			// randomly select a destination...
			var ndest = Math.floor(Math.random()*(startGraph.nodes.length-1));
			var p = degrees[ndest]/degreesSum;
			var coin = Math.random();
			
			if (coin <= p) {
				var ng = new SimpleNets();
				ng.nodes = Object.assign(ng.nodes,startGraph.nodes);
				ng.edges = Object.assign(ng.edges,startGraph.edges);
				ng.nodes.push(ng.nodes.length);			
				ng.edges.push([ng.nodes.length-1,ndest]);
				ng.edges.push([ndest,ng.nodes.length-1]);
				arrGraph[t] = ng;
				startGraph = ng;
				t++;
			}
		}
		return arrGraph;
		
	}

	//you can add your own export function
	toCy() {
		var tmpNodes = this.nodes;
		var tmpEdges = this.edges;
		this.nodes = [];
		this.edges = [];
		for (var i=0;i<tmpNodes.length;i++) {
			this.nodes.push({data:{id:tmpNodes[i], name:tmpNodes[i]}});
		}
		for (var j=0;j<tmpEdges.length;j++) {
			this.edges.push({data:{source:tmpEdges[j][0], target:tmpEdges[j][1]}});
		}	
		return this;
	}
	
	shortestPath() {
		var distances = [];
		for (var i=0;i < this.nodes.length;i++) {
			distances[i] = new Array(this.nodes.length);
			for (var j=0;j < this.nodes.length;j++) {
				distances[i][j] = Infinity;
			}
		}

		this.edges.forEach(function(e) {
			var source = e[0];
			var dest = e[1];
			distances[source][dest] = 1;
			distances[dest][source] = 1;
		});

		this.nodes.forEach(function(n) {
			distances[n][n] = 0;
		});

		
		this.edges.forEach(function(e) {
			var source = e[0];
			var dest = e[1];
			distances[source][dest] = 1;
		});
		this.nodes.forEach(function(n) {
			var source = n;
			var dest = n;
			distances[source][dest] = 0;
		});
		for (var k=0;k < this.nodes.length;k++) {
			for (var i=0;i < this.nodes.length;i++) {
				for (var j=0;j < this.nodes.length;j++) {
					if (distances[i][j] > distances[i][k] + distances[k][j])
						distances[i][j] = distances[i][k] + distances[k][j];
				}
			}
		}
	return distances;
	}

	diameter() {
	var distances = this.shortestPath();
	var max = 0;
	var l = distances[0].length;
	for (var i=0; i<l;i++) {
		for (var j=0; j<l; j++) {
			if (distances[i][j]>max)
				max = distances[i][j];
		}
	}
	return max;
	}
	
	inDegrees() {
		var degrees = [];
		for (var i=0;i<this.nodes.length;i++) {
			var n = this.nodes[i];
			degrees[i] = 0;
			for(var j=0;j<this.edges.length;j++) {
				var e = this.edges[j];
				if (e[1]==n)
					degrees[i] += 1;
			}
		}
		return degrees;
	}
	
	outDegrees() {
		var degrees = [];
		for (var i=0;i<this.nodes.length;i++) {
			var n = this.nodes[i];
			degrees[i] = 0;
			for(var j=0;j<this.edges.length;j++) {
				var e = this.edges[j];
				if (e[0]==n)
					degrees[i] += 1;
			}
		}
		return degrees;
	}
	
	degrees() {
		var degrees = [];
		var iDegrees = this.inDegrees();
		var oDegrees = this.outDegrees();
		for(var i = 0; i < iDegrees.length; i++){
			degrees.push(iDegrees[i] + oDegrees[i]);
		}
		return degrees;
	}
	
	degreeDistribution() {
		var degrees = this.degrees();
		var maxDegree = Math.max(...degrees);
		var distribution = [];
		for (var i = 0; i < maxDegree; i++) {
			distribution[i] = degrees.filter(function(x){return x==i}).length;
		}
		return distribution;
	}
	
	closenessCentrality() {
		var sp = this.shortestPath();
		var cc = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var sum = 0;
			for (var j = 0; j < this.nodes.length; j++) {
				if (i != j) {
					sum += sp[i][j];
				}
			}
			cc[i] = (this.nodes.length-1)/sum;
		}
		return cc;
	}
	
	decayCentrality(delta) {
		var sp = this.shortestPath();
		var dc = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var sum = 0;
			for (var j = 0; j < this.nodes.length; j++) {
				if (i != j) {
					sum += Math.pow(delta,sp[i][j]);
				}
			}
			dc[i] = sum;
		}
		return dc;
	}
	

}