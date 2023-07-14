import { useCallback, useState, Fragment, useEffect } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import LoadingOverlay from "react-loading-overlay-ts";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface BookListType {
  key: string;
  type: string;
  seed: string[];
  title: string;
  title_suggest: string;
  title_sort: string;
  edition_count: number;
  edition_key: string[];
  publish_date: string[];
  publish_year: number[];
  first_publish_year: number;
  number_of_pages_median: number;
  lccn: string[];
  publish_place: string[];
  oclc: string[];
  contributor: string[];
  lcc: string[];
  isbn: string[];
  last_modified_i: number;
  ebook_count_i: number;
  ebook_access: string;
  has_fulltext: boolean;
  public_scan_b: boolean;
  ia: string[];
  ia_collection: string[];
  ia_collection_s: string;
  lending_edition_s: string;
  lending_identifier_s: string;
  printdisabled_s: string;
  readinglog_count: number;
  want_to_read_count: number;
  currently_reading_count: number;
  already_read_count: number;
  cover_edition_key: string;
  cover_i: number;
  publisher: string[];
  language: string[];
  author_key: string[];
  author_name: string[];
  author_alternative_name: string[];
  place: string[];
  subject: string[];
  id_goodreads: string[];
  id_librarything: string[];
  ia_box_id: string[];
  publisher_facet: string[];
  place_key: string[];
  subject_facet: string[];
  _version_: number;
  place_facet: string[];
  lcc_sort: string;
  author_facet: string[];
  subject_key: string[];
}

function App() {
  const [bookname, setBookName] = useState<string>("");
  const [bookList, setBookList] = useState<Array<BookListType>>([]);
  const [sortBookList, setSortBookList] = useState<Array<BookListType>>([]);
  const [selected, setSelected] = useState<string>("Most Relevant");
  const [loading, setLoading] = useState<boolean>(false);
  const sortOption = ["Most Relevant", "Most Recent"];

  const getBookList = (name: string) => {
    setLoading(true);
    setSortBookList([])
    axios
      .get(`https://openlibrary.org/search.json?q=${name}`)
      .then((res) => {
        setBookList(res.data.docs);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selected === "Most Relevant") {
      setSortBookList(bookList);
    } else {
      const temp = [...bookList];
      temp.sort(function (a, b) {
        return b.first_publish_year - a.first_publish_year;
      });
      setSortBookList(temp);
    }
  }, [bookList, selected]);

  const debounceFn = useCallback(debounce(getBookList, 300), []);

  const handleNameChange = (e: any) => {
    setBookName(e.target.value);
    debounceFn(e.target.value);
  };

  return (
    <div className="container m-auto my-10">
      <div className="mx-6">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Search
        </label>
        <div className="relative mt-2">
          <input
            type="text"
            name="name"
            id="name"
            className="peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 focus:outline-none"
            placeholder="Input the book name"
            onChange={handleNameChange}
            value={bookname}
          />
          <div
            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="sm:flex sm:items-center gap-2">
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                  Sort By
                </Listbox.Label>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 min-w-[150px]">
                    <span className="block truncate">{selected}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {sortOption.map((option) => (
                        <Listbox.Option
                          key={option}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={option}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {option}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-indigo-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        <div className="mt-8 flow-root">
          <LoadingOverlay
            active={loading}
            spinner
            className="min-h-[500px] px-2"
          >
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Book Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Author Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        First Published
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        ISBN Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Pages
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {!!sortBookList.length &&
                      sortBookList.map((book) => (
                        <tr key={book.key}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 max-w-[120px] xl:max-w-[300px] truncate">
                            {book.title}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[120px] xl:max-w-[300px] truncate">
                            {book.author_name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {book.first_publish_year}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[120px] xl:max-w-[300px] truncate">
                            {book.isbn}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {book.number_of_pages_median}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </LoadingOverlay>
        </div>
      </div>
    </div>
  );
}

export default App;
