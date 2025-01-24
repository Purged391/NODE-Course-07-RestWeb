import { CreateTodoDto, TodoDatasource, TodoEntity, TodoRepository, UpdateTodoDto } from "../../domain";

export class TodoRepositoryImpl implements TodoRepository{
    
    constructor(
        private readonly datasource: TodoDatasource,
    ){}

    public create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        return this.datasource.create(createTodoDto);
    }
    public getAll(): Promise<TodoEntity[]> {
        return this.datasource.getAll();
    }
    public findById(id: number): Promise<TodoEntity> {
        return this.datasource.findById(id);
    }
    public updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        return this.datasource.updateById(updateTodoDto);
    }
    public deleteById(id: number): Promise<TodoEntity> {
        return this.datasource.deleteById(id);
    }

}