class APIFeatures {
  constructor(query, queryString) {
    // mongoose query & queryString from express(client)
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // spreading req.query creates a new object so the ref points away fro the original req.query.
    // 1A. Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]); // this modifies the queryObj by deleting el equivalent to those in excludedField array

    // 1B. Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    );

    this.query = this.query.find(queryStr);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // query.sort is a method from mongoose
      // sort('stringOne stringTwo') the sort function works like this...it takes a string or strings separated by spaces as argument/s
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // putting a minus excludes from query
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // we return 1 page worth pf result in case of many pages -> bandwitdth
    const limit = this.queryString.limit * 1 || 100; // we limit results to the first 100 ^^^
    const skip = (page - 1) * limit; // when user request say page 2, this will skip results in page 1, and only return those on page 2...works for all other cases

    this.query = this.query.skip(skip).limit(limit); // skips(x) skips x results before quering data
    return this;
  }
}

module.exports = APIFeatures;
