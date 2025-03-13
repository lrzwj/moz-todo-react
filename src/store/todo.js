import { nanoid } from "nanoid";
import {create} from "zustand"
import { persist } from "zustand/middleware"
import {serverUrl}  from "../constants";
//export interface Task{
//  id:string,
//  name:string,
//  completed:Boolean  
//}
//export interface TaskState{
//  task:Task[],
//  fetchAllTasks:() => void,
//  //updateTask:() =>void,
//  //deleteTask:() =>void
//}
export const useTaskStore=create()(
    persist((set,get) =>({
    allTasks: [],

    fetchAllTasks:() => {
        fetch(serverUrl+"/todo/all").then((res) =>{
            return res.json();
          }).then((todos) =>{
              set({allTasks:todos})
              
          })  
    },
    addTask:(name) =>{
        const id=`todo-${nanoid()}`;
        fetch(serverUrl+"/todo/add?id="+id+"&name="+name,{
            method:"post"
          }).then((res) =>{
            const newTask = { id, name, completed: false };
            set({allTasks:[...get().allTasks,newTask]})
          })
    },
    deleteTask:(id) =>{
        fetch(serverUrl+"/todo/delete?id="+ id).then((res) =>{
            const remainingTasks = get().allTasks.filter((task) => id !== task.id);
            set({allTasks:remainingTasks})
          })
    },
    editTask:(id,newName,completed) =>{
        fetch(serverUrl+"/todo/update?id="+ id+"&name="+newName+"&completed="+ completed,{
          method:"post"
        }).then((res) =>{
          const editedTaskList = get().allTasks.map((task) => {
            // if this task has the same ID as the edited task
            if (id === task.id) {
              // Copy the task and update its name
              return { ...task, name: newName };
            }
            // Return the original task if it's not the edited task
            return task;
          });
            set({allTasks:editedTaskList})
          })
    },
    toggleTaskCompleted:(id,name,completed) =>{
        fetch(serverUrl+"/todo/update?id="+ id +"&name="+name+"&completed="+ completed,{
          method:"post"
        }).then((res) =>{
          const updatedTasks = get().allTasks.map((task) => {
            // if this task has the same ID as the edited task
            if (id === task.id) {
              // use object spread to make a new object
              // whose `completed` prop has been inverted
              return { ...task, completed: !task.completed };
            }
            return task;
          });
          set({allTasks:updatedTasks})
        })
    }
}),
      {name:"tasks"}
  )
)