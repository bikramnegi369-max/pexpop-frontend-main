
import { api } from "../../services/api";
import {
  Label,
  TextInput,
} from "flowbite-react";
const SearchManagerEntries = function ({ setEntries }: { setEntries: any }) {

  const searchData = async (e: any) => {
    const res = await api.post(`manager/search-entry/?search=${e.target.value}`);
    setEntries(res.data.data)
  }



  return (
    <>

      <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
        <Label htmlFor="products-search" className="sr-only">
          Search
        </Label>
        <div className="relative mt-1 lg:w-64 xl:w-96">
          <TextInput
            onChange={searchData}
            id="products-search"
            name="products-search"
            placeholder="Search for products"
          />
        </div>
      </form>


    </>

  );
};
export default SearchManagerEntries