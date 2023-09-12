import { List, AutoSizer } from "react-virtualized";

const VirtualizedList = ({
  childeren,
  height,
  width,
  rowHeight,
  rowCount,
  rowRenderer,
}) => {
  return (
    <List
      height={height}
      width={width}
      rowCount={rowCount}
      rowHeight={rowHeight}
      rowRenderer={rowRenderer}
      overscanRowCount={10}
      
    />
  );
};

export default VirtualizedList;
