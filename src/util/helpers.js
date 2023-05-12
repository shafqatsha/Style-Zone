exports.handleError = ({ error, message, code, next }) => {
  if (!error) error = new Error(message);
  error.statusCode = error.statusCode || code;
  if (next) return next(error);
  throw error;
};

exports.paginate = ({baseURL, totalItems, page, page_size }) => {
  try {
    const totalPages = Math.ceil(totalItems / page_size);
    const nextPage = +page + 1;
    const next_page_url = totalPages > 1 && nextPage <= totalPages ? baseURL + nextPage : null;
    const prevPage = +page - 1;
    const previous_page_url = page > 1 ? baseURL + prevPage : null;

    return {next_page_url,
      previous_page_url}
  } catch (error) {
    this.handleError(error);
  }
};
