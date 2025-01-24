import { Request, Response } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from '../../domain';

export class TodosController {
    //* DI - Dependency Injection
    constructor(
        private readonly todoRepository: TodoRepository
    ){}

    private handleError = (response: Response, error: unknown) => {
        if(error instanceof CustomError){
            response.status(error.statusCode).json({error: error.message});
            return;
        }
        response.status(500).json({error: 'Internal Server Error'});
    }

    public getTodos = (req: Request, res: Response) => {
        new GetTodos(this.todoRepository)
        .execute()
        .then(todos => res.json(todos))
        .catch(error => this.handleError(res, error));
        return;
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        new GetTodo(this.todoRepository)
        .execute(id)
        .then(todo => res.json(todo))
        .catch(error => this.handleError(res, error));
        return;
    };

    public createTodo = (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error){
            res.status(400).json({error});
            return;
        }
        new CreateTodo(this.todoRepository)
        .execute(createTodoDto!)
        .then(todo => res.status(201).json(todo))
        .catch(error => this.handleError(res, error));
    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
        if (error){
            res.status(400).json({error});
            return;
        }
        
        new UpdateTodo(this.todoRepository)
        .execute(updateTodoDto!)
        .then(todo => res.json(todo))
        .catch(error => this.handleError(res, error));
        return;
    }

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
       
        new DeleteTodo(this.todoRepository)
        .execute(id)
        .then(todo => res.json(todo))
        .catch(error => this.handleError(res, error));
        return;
    }
}