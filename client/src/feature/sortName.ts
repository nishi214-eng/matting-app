export const sortName = (name1:string,name2:string) => {
    let nameArray:string[] = [name1,name2];
    // 日本語に基づいてソート
    nameArray.sort((a:string,b:string) => a.localeCompare(b, 'ja'));
    return nameArray;
}