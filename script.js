function createData() {
  //setting 'size' of nodes/people, 2<=size<=10
  const size = Math.floor(Math.random() * 8) + 2;

  const people = [];
  for (let i = 1; i <= size; i++) {
    people.push({ id: i, label: 'Person' + i });
  }
  //DataSet holds & mainpulates unstructured data, listens to changes made on it
  people = new vis.DataSet(people);

  //randomly creating edges between people/nodes with random amount
  const edges = [];
  for (let i = 1; i <= size; i++) {
    for (let j = i + 1; j <= size; j++) {
      //randomizing the number of edges for a less-dense graph
      if (Math.random() > 0.5) {
        //Ensuring that edges are not only one way: i-→j or j->i
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
    people: people,
    edges: edges,
  };
  return data;
}
