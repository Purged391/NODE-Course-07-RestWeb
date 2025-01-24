export class UpdateTodoDto{
    private constructor(
        public readonly id: number,
        public readonly text?: string,
        public readonly completedAt?: Date,
    ){}

    public get values() {
        const returnObj: {[key: string]: any} = {};
        if (this.text) returnObj.text = this.text;
        if (this.completedAt) returnObj.completedAt = this.completedAt;
        return returnObj;
    }

    public static create(props: {[key: string]: any}): [string?, UpdateTodoDto?]{
       const {id, text, completedAt } = props;
       let newCompletedAt = completedAt;

        if (!id || isNaN(Number(id))) return ['ID property is required'];
       
       if (completedAt){
        newCompletedAt = new Date(completedAt);   
        if (newCompletedAt.toString() === 'Invalid Date'){
            return ['Invalid date format for completedAt'];
        }
       }
       
       

       return [undefined, new UpdateTodoDto(id, text, newCompletedAt)];
    }
}