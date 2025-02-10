export const insertIssue = (arrayOfIssues, issue) => {
  const newArray = [...arrayOfIssues];
  newArray.unshift(issue);
  updateIndexes(newArray);
  return newArray;
};

const updateIndexes = (arrayOfIssues) => arrayOfIssues.map((issue, index) => (issue.index = index));

export const updateStatuses = (boards) => {
  return boards.map((board) => ({
    ...board,
    items: board.items.map((issue) => (issue.status === board.title ? issue : { ...issue, status: board.title, updated: Date.now() })),
  }));
};

export const moveInsideAnArray = ({ state, source, destination }) => {
  const sInd = +source.droppableId;
  const list = state[sInd].items;
  const startIndex = source.index;
  const endIndex = destination.index;

  const changedList = Array.from(list);
  const [removed] = changedList.splice(startIndex, 1);
  changedList.splice(endIndex, 0, removed);

  const result = [...state];
  result[sInd].items = changedList.map((item, index) => ({ ...item, index }));

  return result;
};

export const moveInsideAnArrayOfArrays = ({ state, sInd, dInd, source, destination }) => {
  const sourceClone = Array.from(state[sInd].items);
  const destClone = Array.from(state[dInd].items);
  const [removed] = sourceClone.splice(source.index, 1);

  destClone.splice(destination.index, 0, removed);

  const result = [...state];
  result[sInd].items = sourceClone.map((item, index) => ({ ...item, index }));
  result[dInd].items = destClone.map((item, index) => ({ ...item, index }));

  return result;
};

export const addChildToThree = (parentId, item) => (el) => {
  if (el.id === parentId) return { ...el, children: [...el.children, item] }
  else return { ...el, children: el.children.map(addChildToThree(parentId, item)) }
}