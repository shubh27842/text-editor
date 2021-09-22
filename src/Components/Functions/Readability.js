import {syllable} from "syllable";

function Readability(text){
    const sentence= text.split(".");
    const sentenceCount = sentence.length-1;
    let wordCount = 0;
    let syll = 0
    sentence.map((val,i)=>{
        val = val.split("\n");
        val.map(val1=>{
            val1 = val1.split(" ");
            wordCount += val1.length;
            console.log(val1.length)
            val1.map(v=>{
                v=v.replace(", ","");
                let s = syllable(v);
                syll+=s;
            })
        })
    })
    const asl = wordCount/sentenceCount;
    const asw = syll/wordCount; 
    const RE = 206.835 - (1.015*asl) - (84.6*asw);
    console.log(RE.toFixed(0));
    if(RE<10)
        return "Extremely hard to read";
    else if(RE>=10 && RE<30)
        return "Very hard to read";
    else if(RE>=30 && RE<50)
        return "Hard to read";
    else if(RE>=50 && RE<60)
        return "Fairly hard to read";
    else if(RE>=60 && RE<70)
        return "Easily understood";
    else if(RE>=70 && RE<80)
        return "Fairly easy to read";
    else if(RE>=80 && RE<90)
        return "Easy to read";
    else if(RE>=90 && RE<=100)
        return "Very easy to read";
    else
        return "-"
}

export default Readability;