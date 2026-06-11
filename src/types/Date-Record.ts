import EntryInputs from "./Entry";

export interface DateRecord {
    date:string,
    entries: EntryInputs[],
    costing_inr: number,
}