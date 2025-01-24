import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';


describe('Todo route testing', () => {
    beforeAll(async() => {
        await testServer.start();
    });

    afterAll(async() => {
        await testServer.close();
    });
    beforeAll(async() => {
        await prisma.todo.deleteMany();
    });

    const todo1 =  {text: 'Todo 1'};
    const todo2 =  {text: 'Todo 2'};

    test('Should return todos api/todos', async() => {
        await prisma.todo.createMany({data: [todo1, todo2]});
        const {body} = await request(testServer.app)
        .get('/api/todos')
        .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);

    });

    test('should return a TODO api/todos/:id', async() => {
        
        const createdTodo = await prisma.todo.create({data: todo1});
        const {body} = await request(testServer.app)
        .get(`/api/todos/${createdTodo.id}`)
        .expect(200);

        expect(body).toEqual({
            id: createdTodo.id, 
            text: createdTodo.text,
            completedAt: createdTodo.completedAt
        });
    });

    test('should return 404 Not Found error api/todos/:id', async() => {
        const id = 99;
        const {body} = await request(testServer.app)
        .get(`/api/todos/${id}`)
        .expect(404);

        expect(body).toEqual({error: `Todo with id ${id} not found`});
    });

    test('should create a new todo api/todos', async() => {
        const {body} = await request(testServer.app)
        .post('/api/todos')
        .send(todo1)
        .expect(201);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        });
    });
    test('should return error if text is not valid api/todos', async() => {
        const {body} = await request(testServer.app)
        .post('/api/todos')
        .send({})
        .expect(404);

        expect(body).toEqual({error: 'Text property is required'});
    });
    test('should return error if text is empty api/todos', async() => {
        const {body} = await request(testServer.app)
        .post('/api/todos')
        .send({text: ''})
        .expect(404);

        expect(body).toEqual({error: 'Text property is required'});
    });
    test('should return an updated todo api/todos/:id', async() => {
        
        const createdTodo = await prisma.todo.create({data: todo1});

        const {body} = await request(testServer.app)
        .put(`/api/todos/${createdTodo.id}`)
        .send({
            id: createdTodo.id,
            text: 'Updated Todo',
            completedAt: "2021-09-01T00:00:00.000Z"
        })
        .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: 'Updated Todo',
            completedAt: "2021-09-01T00:00:00.000Z"
        });
    });
    test('should return 404 if todo not found api/todos', async() => {
        const id = 99;
        const {body} = await request(testServer.app)
        .put(`/api/todos/${id}`)
        .send({
            id: id,
            text: 'Updated Todo',
            completedAt: "2021-09-01T00:00:00.000Z"
        })
        .expect(404);

        expect(body).toEqual({error: `Todo with id ${id} not found`});
    });

    test('should return only the date updated api/todos', async() => {
        
        const createdTodo = await prisma.todo.create({data: todo1});

        const {body} = await request(testServer.app)
        .put(`/api/todos/${createdTodo.id}`)
        .send({
            completedAt: "2021-09-01T00:00:00.000Z"
        })
        .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: "2021-09-01T00:00:00.000Z"
        });
    });

    test('should delete a Todo api/todos/:id', async() => {
        
        const createdTodo = await prisma.todo.create({data: todo1});

        const {body} = await request(testServer.app)
        .delete(`/api/todos/${createdTodo.id}`)
        .expect(200);

        expect(body).toEqual({
            id: expect.any(Number), 
            text: createdTodo.text,
            completedAt: null
        });
    });
    test('should return 404 if not exists api/todos/:id', async() => {
        const id = 99;
        const {body} = await request(testServer.app)
        .delete(`/api/todos/${id}`)
        .expect(404);

        expect(body).toEqual({error: `Todo with id ${id} not found`});
    });
});