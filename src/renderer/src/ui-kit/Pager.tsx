import { Icon } from '../Icon';
import { useUpdateParams } from '../nav/useInternalNav';

export function Pager({
  currentPage: currentPage,
  numPages,
}: {
  currentPage: number;
  numPages: number;
}) {
  const updateParams = useUpdateParams();
  return (
    <>
      {currentPage > 1 ? (
        <>
          <Icon
            onClick={() => updateParams({ page: '1' })}
            src="control-stop-180"
            title="First Page"
          />
          <Icon
            onClick={() => updateParams({ page: `${currentPage - 1}` })}
            src="control-180"
            title="Previous Page"
          />
        </>
      ) : (
        <>
          &nbsp; &nbsp;
          <Icon src="placeholder" alt="-" />
          &nbsp;
          <Icon src="placeholder" alt="-" />
          &nbsp;
        </>
      )}
      {numPages === 1 ? (
        '1'
      ) : (
        <select
          name={`page${currentPage}`}
          value={currentPage}
          onChange={({ target: { value } }) => updateParams({ page: value })}
        >
          {[...new Array(numPages).keys()].map((pageNumber) => {
            const isSelected = currentPage === pageNumber + 1;
            return (
              <option value={pageNumber + 1} selected={isSelected}>
                {pageNumber + 1}
              </option>
            );
          })}
        </select>
      )}
      {`of ${numPages}`}
      {currentPage < numPages ? (
        <>
          <Icon
            src="control"
            title="Next Page"
            onClick={() => {
              updateParams({ page: `${currentPage + 1}` });
            }}
          />
          &nbsp;
          <Icon
            src="control-stop"
            title="Last Page"
            onClick={() => updateParams({ page: `${numPages}` })}
          />
          &nbsp; &nbsp;
        </>
      ) : (
        <>
          <Icon src="placeholder" alt="-" />
          &nbsp;
          <Icon src="placeholder" alt="-" />
          &nbsp; &nbsp;
        </>
      )}
    </>
  );
}