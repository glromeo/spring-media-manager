import iso from "./iso-639-1.json";

export default iso;

export const languages = Object.keys(iso).reduce((languages, cc)=> {
    languages[iso[cc].name] = cc;
    return languages;
}, {});
