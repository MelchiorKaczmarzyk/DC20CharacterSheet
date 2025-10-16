export class ClassTalentOption {
    public selected : boolean = false;
    public name: string = "";
    public text: string = "";

    /*
        capturing the results from onSelect() of all the options, merging them and then
        merging them with the results of it's own onSelect method. Returning the merge.
    */
    public onSelect: () => any = ()=>{};
    /*
        capturing the results from onSelect() of all the options, merging them and then
        merging them with the results of it's own onSelect method. Returning the merge.
    */
    public revert: () => any = ()=>{};
}