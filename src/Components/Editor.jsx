import React, { useRef, useState,useEffect } from "react";
import "./Editor.css";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {Editor, EditorState, RichUtils} from 'draft-js';
import PowerWord from "./Functions/PowerWord";
import Readability from "./Functions/Readability";

const keywords = [
    "computer science","machine learning","web development","artificial intelligence","data science","data analytics","data structure","android programming"
]


const EditorText = () => {
    const [value,setValue] = useState("");
    const [selectedText,setSelectedText] = useState("");
    const [wordCount,setWordCount] = useState(0);
    const [pwordCount,setPWordCount] = useState(0);
    const [matchedKeys,setMatchedKeys] =useState([]);
    const [readability,setReadability] = useState("");
    const editor = useRef();
    const headOneRef = useRef();
    const headTwoRef = useRef();
    const headThreeRef = useRef();
    const listBtnRef = useRef();
    const boldBtn = useRef();
    const italicBtn = useRef();
    const underBtn = useRef();

    const [editorState,setEditorState] = useState(()=> EditorState.createEmpty());

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState,command);
        if(newState){
            onChange(newState);
            return true;
        }
        return false;
    }
    useEffect(()=>{
        wordCountMethod();
        findKeywords(editorState);
        // console.log(Readability(editorState.getCurrentContent().getPlainText()))
        setReadability(Readability(editorState.getCurrentContent().getPlainText()));
        onChange(editorState);
       
    },[editorState]);

    const checkBtnActive = () => {
        (editorState.getCurrentInlineStyle().has("BOLD")) ? boldBtn.current.classList.add("buttonActive") : boldBtn.current.classList.remove("buttonActive"); 
        (editorState.getCurrentInlineStyle().has("ITALIC")) ? italicBtn.current.classList.add("buttonActive") : italicBtn.current.classList.remove("buttonActive"); 
        (editorState.getCurrentInlineStyle().has("UNDERLINE")) ? underBtn.current.classList.add("buttonActive") : underBtn.current.classList.remove("buttonActive"); 
        (RichUtils.getCurrentBlockType(editorState) === "unordered-list-item") ? listBtnRef.current.classList.add("buttonActive") : listBtnRef.current.classList.remove("buttonActive");
        (RichUtils.getCurrentBlockType(editorState) === "header-one") ? headOneRef.current.classList.add("buttonActive") : headOneRef.current.classList.remove("buttonActive");
        (RichUtils.getCurrentBlockType(editorState) === "header-two") ? headTwoRef.current.classList.add("buttonActive") : headTwoRef.current.classList.remove("buttonActive");
        (RichUtils.getCurrentBlockType(editorState) === "header-three") ? headThreeRef.current.classList.add("buttonActive") : headThreeRef.current.classList.remove("buttonActive");
    }

    const onChange = (editorState) => {
        const selection = editorState.getSelection();
        const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
        var anchor = editorState.getSelection().getAnchorKey();
        checkBtnActive();
        setEditorState(editorState);
    }

    const onStyleClick = (style) => {
        onChange(RichUtils.toggleInlineStyle(editorState,style));
    }

    const onUndoClick = () =>{
        onChange(EditorState.undo(editorState))
    }

    const onRedoClick = () =>{
        onChange(EditorState.redo(editorState));
    }

    const onHeadClick = (head) => {
        checkBtnActive();
        onChange(RichUtils.toggleBlockType(editorState,head));
    }

    const wordCountMethod = () => {
        const text = editorState.getCurrentContent().getPlainText();
        console.log(text)
        const lineArray = text.split("\n");
        let word = 0;
        let powerWord=0;
        lineArray.map(val=>{
            val=val.split(" ");
           val && val.map(val1=>{
               PowerWord(val1) ? powerWord+=1 : powerWord=powerWord;
               val1 ? word+=1 : word=word;
           })
        });
        setWordCount(word);
        setPWordCount(powerWord);
    } 

    

    const findKeywords = (editorState) => {
        const text = editorState.getCurrentContent().getPlainText().split("\n");
        text.map(val=>{
        const str = val.split(" ");
        const inKey = str[str.length -2]+ " " + str[str.length -1];
        const matchedKeyword = keywords.find(p=>{
            return (p.toLowerCase() === inKey.toLowerCase());
        });
        if(matchedKeyword){
            const temp = matchedKeys;
            const already = temp.find(p=>{
                return p.toLowerCase() === matchedKeyword.toLowerCase();
            })
            if(!already)
                temp.push(matchedKeyword);
            setMatchedKeys(temp)
        }
    })
        
    }


    return(
        <div className=" d-flex">
            <div className="editor" style={{
                borderRight: "1px solid #d2d2d2",
                height: "100vh"
            }}>
                <div className="d-flex justify-content-between align-items-center btnBar py-1 px-2">
                    <div className="d-flex">
                        <button  className="btn " ref={boldBtn}  onMouseDown={(e) => e.preventDefault()} onClick={()=> onStyleClick("BOLD")} >
                            <FormatBoldIcon  />
                        </button>
                        <button className="btn" ref={italicBtn}  onMouseDown={(e) => e.preventDefault()} onClick={()=> onStyleClick("ITALIC")} >
                            <FormatItalicIcon />
                        </button>
                        <button className="btn" ref={underBtn}  onMouseDown={(e) => e.preventDefault()} onClick={()=> onStyleClick("UNDERLINE")} >
                            <FormatUnderlinedIcon />
                        </button>
                        <button className="btn" style={{
                            fontSize: "18px",
                            fontWeight: "600",
                        }} ref={headOneRef}  onMouseDown={(e) => e.preventDefault()}  onClick={() => { onHeadClick("header-one");}}>
                            H1
                        </button>
                        <button className="btn" style={{
                            fontSize: "18px",
                            fontWeight: "600",
                        }} ref={headTwoRef} onMouseDown={(e) => e.preventDefault()}  onClick={() => { onHeadClick("header-two");}}>
                            H2
                        </button>
                        <button className="btn" style={{
                            fontSize: "18px",
                            fontWeight: "600",
                        }} ref={headThreeRef} onMouseDown={(e) => e.preventDefault()} onClick={() => { onHeadClick("header-three");}}>
                            H3
                        </button>
                        <button className="btn" ref={listBtnRef} onMouseDown={(e) => e.preventDefault()} onClick={() => { onHeadClick("unordered-list-item");}}>
                            <FormatListBulletedIcon />
                        </button>
                        <button className="btn" onClick={() =>{  onUndoClick();}}>
                            <UndoIcon/>
                        </button>
                        <button className="btn" onClick={() => { onRedoClick(); }}>
                            <RedoIcon />
                        </button>
                    </div>
                    <div className="d-flex">
                        <button className="btn1">
                            Instruct Me
                        </button> 
                        <button className="btn1">
                            Unstruck Me
                        </button> 
                        <button className="btn1">
                            Write more
                        </button> 
                    </div>   
                </div>
                <div className="editorWrapper" >
                    
                    <Editor 
                        editorState={editorState} 
                        handleKeyCommand={handleKeyCommand}
                        onChange={onChange} 
                        placeholder="Please start from here...."
                        ref={editor}
                        />
                  
                </div>
            </div>
            <div className="p-3 sidebar">
                <div className="w-100">
                    <p className="mb-2  sideBarHead">Performance</p>
                    <table className="sideTable w-100">
                        <tbody>
                            <tr className="d-flex flex-column px-3 py-1 position-relative">
                                <th >Power Words</th>
                                <td>{pwordCount}</td>
                                <td className="position-absolute" style={{right: "10px" , top: "15px", cursor: "pointer", color: "#BDBDBD"}}> <InfoOutlinedIcon sx={{width: "20px"}} /> </td>
                            </tr>
                            <tr className="d-flex flex-column  px-3 py-1 position-relative">
                                <th>Readability</th>
                                <td>{readability}</td>
                                <td className="position-absolute" style={{right: "10px" , top: "15px", cursor: "pointer", color: "#BDBDBD"}}> <InfoOutlinedIcon sx={{width: "20px"}} /> </td>
                            </tr>
                            <tr className="d-flex flex-column  px-3 py-1">
                                <th>Words Count</th>
                                <td className="text-primary">{wordCount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="my-4 w-100">
                    <p className="mb-2  sideBarHead">Add Ons</p>
                    <div className="px-3 py-2 w-100" style={{
                        border: "1px solid #EEEEEE",
                        borderRadius: "5px",
                    }}>
                        <button style={{
                            backgroundColor: "#673AB7",
                            borderRadius: "5px",
                            color: "#FFF",
                            padding: "5px 15px",
                        }}>
                            Fast Check
                        </button>
                    </div>
                </div>
                <div className="w-100">
                    <p className="mb-2 sideBarHead d-inline-block">Keywords to Use</p>
                    <span className="mx-2 "><InfoOutlinedIcon sx={{ cursor: "pointer", color: "#BDBDBD",width: "20px"}} /></span>
                    {/*<input className="w-100" type="text" placeholder="Please input a topic" style={{
                        border: "none",
                        borderRadius: "5px",
                        background: "#F5F5F5",
                        height: "40px",
                        textIndent: "15px"
                    }} />

                    <button className="btn buttonActive mt-5">
                        <SearchIcon />
                    </button>*/}
                   <div className="keywordWrapper">

                   {
                        keywords.map((val,i)=>{
                            const green = matchedKeys.find(p=>{
                                return p.toLowerCase() === val.toLowerCase();
                            })
                            return(
                                <div className="keyword" style={ green ? { background: "#00C853" } :{ background: "#F50057" }} >{val}</div>
                            )
                        })
                    }
                   </div>
                    
                </div>

            </div>
        </div>
    )   
};

export default EditorText;