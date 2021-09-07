import React, { useContext, useEffect, useState } from "react";
import Results from "./Results";
import axios from "axios";
import * as AppConstant from "./AppConstant";
import useDropdown from "./useDropdown";
import ColorContext from "./ColorContext";

const SearchArea = () => {
  const [themeColor,setThemeColor]= useContext(ColorContext);
  const [keyword, setKeyword] = useState("budgies");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] =useState(false);
  const orderList = ["date","relevance","rating","title","viewCount"];
  const [order,OrderDropdown] = useDropdown("Order By","relevance",orderList);
  const [safeSearch,SafeSearchDropdown]=useDropdown("Safe Search","none",["moderate","none","strict"]
  );
  const[checked,setChecked] =useState(true);
  const [advancedParams,setAdvancedParams] = useState(``);
  useEffect(()=>{
    if(checked){
      setAdvancedParams(`&order=${order}&safeSearch=${safeSearch}`)
    }else{
      setAdvancedParams(``);

    }


  }, [checked,order,safeSearch])

  async function requestSearch() {
    setLoading(true);
    axios
      .get(
        `${AppConstant.SEARCH_URL}&q=${keyword}${advancedParams}`
      )
      .then((res) => {
        const { items } = res.data;
        console.log(items);
        setVideos(items || []);
        setLoading(false);
      })
      .catch((err) => console.log(err));

    console.log("Video request submitted");
  }

  return (
    <div className="search-area">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestSearch();
        }}
      >
        <label htmlFor="keyword">
          Search
          <input
            id="keyword"
            value={keyword}
            placeholder="Search Keyword"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>
        <label htmlFor="advanced">
           Advanced Search
           <input type="checkbox" id="advanced"
           checked={checked}
           onChange={()=>setChecked(!checked)}
          />
        </label>
        {
          checked ? <div>
            <OrderDropdown/>
        <SafeSearchDropdown/>
        <label htmlFor="themeColor">
          Theme Color
          <select
           value={themeColor}
           onChange={(e)=>setThemeColor(e.target.value)}
           onBlur={(e)=>setThemeColor(e.target.value)}
           >
             <option value="#ad343e">Dark Red</option>
             <option value="darkblue">Dark Blue</option>
             <option value="green">Green</option>
             <option value="aqua">Aqua</option>
           </select>
        </label>
          </div>: null
        }
        
        <button style={{backgroundColor:themeColor }}>Submit</button>
      </form>
      <Results videos={videos} loading={loading} />
    </div>
  )
}

export default SearchArea;
