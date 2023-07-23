import React, { SetStateAction } from 'react';
interface Props {
  searchedName: string;
  setSearchedName: React.Dispatch<SetStateAction<string>>;
}

const PatientSearch = ({ searchedName, setSearchedName }: Props) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedName(e.target.value);
    console.log(searchedName);
  };
  return (
    <>
      <input
        type="text"
        className="rounded-lg border px-2 w-[20rem] h-10"
        placeholder="Search patient name"
        value={searchedName}
        onChange={handleSearch}
      />
    </>
  );
};

export default PatientSearch;
