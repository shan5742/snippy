import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Snippet from "../components/Snippet";
import useSWR from "swr";
import LoadingSpinner from "../components/LoadingSpinner";
import languages from "../utils/Languages";

export default function Home() {
  const { data: snippets, mutate } = useSWR("/api/snippets");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [select, setSelect] = useState("");

  useEffect(() => {
    setSearchResults(snippets);
  }, [snippets]);

  useEffect(() => {
    if (snippets) {
      const results = snippets.filter((s) =>
        s.data.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelect(value);
  };

  useEffect(() => {
    if (select == "") {
      setSearchResults(snippets);
    } else {
      const results = snippets.filter(
        (snippet) => snippet.data.language === select
      );
      setSearchResults(results);
    }
  }, [select]);

  if (!snippets) return <LoadingSpinner />;

  return (
    <div className="">
      <Head>
        <title>Snippy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="my-12">
          <div className="flex items-center">
            <h1 className="font-bold text-green-100 text-5xl mb-4">Snippy</h1>
            <svg
              className="h-12 fill-current text-green-100 ml-4"
              viewBox="0 0 471.641 471.641"
            >
              <path d="M431.666 49.412c-51.692-50.578-134.33-50.567-186.009.025L28.911 266.184C-10.281 306.3-9.532 370.591 30.584 409.783c39.456 38.548 102.47 38.548 141.926 0l196.267-196.267c25.515-25.515 25.515-66.884 0-92.399s-66.884-25.515-92.399 0L88.644 308.85c-6.548 6.78-6.36 17.584.42 24.132 6.614 6.388 17.099 6.388 23.713 0L300.51 145.249c12.449-11.926 32.209-11.501 44.134.948 11.565 12.073 11.565 31.114 0 43.187L148.378 385.65c-26.514 26.137-69.197 25.831-95.334-.683-25.873-26.246-25.873-68.405 0-94.651L269.79 73.569c38.608-38.622 101.214-38.633 139.836-.026 38.622 38.607 38.633 101.214.026 139.836L192.905 430.126c-7.159 6.131-7.993 16.905-1.862 24.064 6.131 7.159 16.905 7.993 24.064 1.862a17.05 17.05 0 001.862-1.862l216.747-216.747c51.357-52.489 50.44-136.674-2.05-188.031z" />
            </svg>
          </div>
          <p className="text-green-200 text-xl mb-4">
            Never have to google that same solution again! All your snippets in
            one place.
          </p>
          <Link href="/new">
            <a className="mt-3 inline-block bg-green-300 hover:bg-green-900 text-green-900 hover:text-green-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Create a Snippet!
            </a>
          </Link>

          <div>
            <p className="font-bold text-s text-green-200 mt-8">
              FILTER BY LANGUAGE
            </p>
            <div className="flex justify-between w-full">
              <div>
                {languages.map((language) => (
                  <label className="mr-4 font-bold text-green-200">
                    <input
                      type="radio"
                      name="radio"
                      value={language}
                      checked={select === language}
                      onChange={(event) => handleSelectChange(event)}
                      className="mr-2"
                    />
                    {language}
                  </label>
                ))}
              </div>
              <button
                className="bg-green-300 text-xs hover:bg-green-300 text-green-900 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mb-2 transform -translate-x-1 translate-y-1"
                type="submit"
                onClick={() => setSelect("")}
              >
                RESET FILTERS
              </button>
            </div>
          </div>
          <p className="font-bold text-s text-green-200 mt-8">SEARCH:</p>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Enter search term..."
            className="w-full border bg-white rounded px-3 py-2 outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchResults &&
          searchResults.map((snippet) => (
            <Snippet
              key={snippet.id}
              snippet={snippet}
              snippetDeleted={mutate}
            />
          ))}
      </main>
    </div>
  );
}
