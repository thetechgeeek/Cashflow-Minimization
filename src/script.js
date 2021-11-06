import { Heap } from './heap.js';

onload = function () {
  // create a network
  let curr_data;
  const container = document.getElementById('mynetwork');
  const container2 = document.getElementById('mynetwork2');
  const genNew = document.getElementById('generate_button');
  const solve = document.getElementById('solve_button');
  const temptext = document.getElementById('init_msg');
  // initialise graph options
  const options = {
    edges: {
      arrows: {
        to: true,
      },
      labelHighlightBold: true,
      font: {
        size: 14,
      },
    },
    nodes: {
      font: '12px arial black',
      scaling: {
        label: true,
      },
      shape: 'icon',
      icon: {
        code: '😄',
        size: 20,
      },
    },
  };
  // initialize your network!
  let network = new vis.Network(container);
  network.setOptions(options);
  let network2 = new vis.Network(container2);
  network2.setOptions(options);

  function createData() {
    const sz = Math.floor(Math.random() * 8) + 2;

    // Adding people to nodes array
    let nodes = [];
    for (let i = 1; i <= sz; i++) {
      nodes.push({ id: i, label: 'Person ' + i });
    }
    nodes = new vis.DataSet(nodes);

    // Dynamically creating edges with random amount to be paid from one to another friend
    const edges = [];
    for (let i = 1; i <= sz; i++) {
      for (let j = i + 1; j <= sz; j++) {
        // Modifies the amount of edges added in the graph
        if (Math.random() > 0.5) {
          // Controls the direction of cash flow on edge
          if (Math.random() > 0.5)
            edges.push({
              from: i,
              to: j,
              label: String(Math.floor(Math.random() * 100) + 1),
            });
          else
            edges.push({
              from: j,
              to: i,
              label: String(Math.floor(Math.random() * 100) + 1),
            });
        }
      }
    }
    const data = {
      nodes: nodes,
      edges: edges,
    };
    return data;
  }

  genNew.onclick = function () {
    const data = createData();
    curr_data = data;
    network.setData(data);
    temptext.style.display = 'inline';
    container2.style.visibility = 'hidden';
  };

  solve.onclick = function () {
    temptext.style.display = 'none';
    container2.style.visibility = 'visible';
    const solvedData = solveData();
    network2.setData(solvedData);
  };

  function solveData() {
    let data = curr_data;
    const sz = data['nodes'].length;
    const vals = Array(sz).fill(0);
    // Calculating net balance of each person
    for (let i = 0; i < data['edges'].length; i++) {
      const edge = data['edges'][i];
      vals[edge['to'] - 1] += parseInt(edge['label']);
      vals[edge['from'] - 1] -= parseInt(edge['label']);
    }

    const pos_heap = new Heap();
    const neg_heap = new Heap();

    for (let i = 0; i < sz; i++) {
      if (vals[i] > 0) {
        pos_heap.insert([vals[i], i]);
      } else {
        neg_heap.insert([-vals[i], i]);
        vals[i] *= -1;
      }
    }

    const new_edges = [];
    while (!pos_heap.empty() && !neg_heap.empty()) {
      const mx = pos_heap.extractMax();
      const mn = neg_heap.extractMax();

      const amt = Math.min(mx[0], mn[0]);
      const to = mx[1];
      const from = mn[1];

      new_edges.push({
        from: from + 1,
        to: to + 1,
        label: String(Math.abs(amt)),
      });
      vals[to] -= amt;
      vals[from] -= amt;

      if (mx[0] > mn[0]) {
        pos_heap.insert([vals[to], to]);
      } else if (mx[0] < mn[0]) {
        neg_heap.insert([vals[from], from]);
      }
    }

    data = {
      nodes: data['nodes'],
      edges: new_edges,
    };
    return data;
  }

  genNew.click();
};
