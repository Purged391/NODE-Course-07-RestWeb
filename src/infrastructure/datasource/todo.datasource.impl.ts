import { prisma } from "../../data/postgres";
import { CreateTodoDto, CustomError, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";

export class TodoDatasourceImpl implements TodoDatasource{
    public async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({
            data: createTodoDto!
        });
        return TodoEntity.fromObject(todo);
    }
    public async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany();
        return todos.map(TodoEntity.fromObject);
    }
    public async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findFirst({
            where: {id}
        });

        if (!todo){
            throw new CustomError(`Todo with id ${id} not found`, 404);
        }
        return TodoEntity.fromObject(todo);
    }
    public async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findById(updateTodoDto.id);
        const updatedTodo = prisma.todo.update({
            where: {id: updateTodoDto.id},
            data: updateTodoDto!.values
       });
       return TodoEntity.fromObject(updatedTodo);
    }
    public async deleteById(id: number): Promise<TodoEntity> {
        await this.findById(id);
        const deleted = await prisma.todo.delete({
            where: {id}
        });
        return TodoEntity.fromObject(deleted);
    }

}