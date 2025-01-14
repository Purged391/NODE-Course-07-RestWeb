import { Request, Response } from 'express';

const todos = [
    {id: 1, text: 'Buy Milk', completedAt: new Date()},
    {id: 2, text: 'Buy Bread', completedAt: null},
    {id: 3, text: 'Buy Butter', completedAt: new Date()},
];

export class TodosController {
    //* DI - Dependency Injection
    constructor(){}

    public getTodos = (req: Request, res: Response) => {
        res.json(todos);
        return;
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            res.status(400).json({error: 'ID argument is not a number'});
            return;
        }
        const todo = todos.find(todo => todo.id === id);
        (todo) ? 
        res.json(todo)
        : res.status(404).json({error: `Todo with id ${id} not found`});
        return;
    };

    public createTodo = (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text){
            res.status(400).json({error: 'Text is required'});
            return;
        }
            const body = req.body;
        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: new Date()
        };
        todos.push(newTodo);
        res.json(newTodo);
    }

    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)){
            res.status(400).json({error: 'ID argument is not a number'});
            return;
        }
        const todo = todos.find(todo => todo.id === id);
        if (!todo){
            res.status(404).json({error: `Todo with id ${id} not found`});
            return;
        }
       const {text, completedAt} = req.body;
       (completedAt)
       ? todo.completedAt = null 
       : todo.completedAt = new Date(completedAt || todo.completedAt);

       todo.text = text || todo.text;
        res.json(todo);
    }

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)){
            res.status(400).json({error: 'ID argument is not a number'});
            return;
        }
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex === -1){
            res.status(404).json({error: `Todo with id ${id} not found`});
            return;
        }
        const todo = todos[todoIndex];
        todos.splice(todoIndex, 1);
        res.json(todo);
    }
}