import React from 'react';
import Pagination from '@material-ui/lab/Pagination';

interface IPropsComponent {
  handleChange:
    | ((event: React.ChangeEvent<unknown>, page: number) => void)
    | undefined;
  page: number;
  total_pages: number;
}

// Componente Pagination

export default function PaginationComponent({
  handleChange,
  page,
  total_pages,
}: IPropsComponent) {
  return (
    <div>
      <Pagination
        count={total_pages}
      page={page}
      color="secondary"
      onChange={handleChange}/>
    </div>
  )
}
