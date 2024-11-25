import { UIArea, Area } from 'src/types';

export function convertUISquareDetails(data: UIArea[]): Area[] {
  const areas: Area[] = [];

  data.map((r) => {
    const area: Area = {
      name: r.title || r.editableTitleValue,
      square: parseInt(r.square, 10),
      areaLocation: r.areaLocation,
    };

    areas.push(area);
  });

  return areas;
};

export function convertSquareDetailsToUI(data: Area[]): UIArea[] {
  const areas: UIArea[] = [];

  data.map((r) => {
    const randomId = (Math.random() + 1).toString(36).substring(8);

    const area: UIArea = {
      id: randomId,
      title: r.name,
      square: r.square.toString(),
      areaLocation: r.areaLocation,
    };

    areas.push(area);
  });

  return areas;
};

export function validateRows(rows: UIArea[]) {
  const isRowsValid = rows.every(
    row => row.square.length > 0 && row.areaLocation?.length > 0 && (row.title?.length > 0 || row.editableTitleValue?.length > 0)
  );

  return isRowsValid;
};

export function createRow(): UIArea {
  const randomId = (Math.random() + 1).toString(36).substring(7);
  const newRow: UIArea = {
    id: randomId,
    square: '',
    editable: true,
    areaLocation: null,
  };

  return newRow;
}

export function generateSquareRows(rowsNumber: number, title: string): UIArea[] {
  const rowItems: UIArea[] = [];

  for (let i = 0; i < rowsNumber; i++) {
    const randomId = (Math.random() + 1).toString(36).substring(8);

    rowItems.push({
      id: randomId,
      title: `${title} ${i + 1}`,
      square: '',
      areaLocation: null,
    });
  };

  return rowItems;
};