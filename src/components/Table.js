import styled from 'styled-components';

export const Table = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-items: center;
`;

export const TableHeader = styled.div`
  grid-column: 1;
  justify-self: end;
  font-weight: 500;
`;

export const TableData = styled.div`
  grid-column: 2;
  color: #555;
`;
