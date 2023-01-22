import React, { useState, useEffect } from 'react';
import './style.css';

const TableContent = (props) => {
  const removeServer = (server) => {
    props.removeServer(server);
  };

  const tableRows = props.list.map((item) => {
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        {props.type === 'SERVERS' && (
          <>
            <td>
              <button onClick={() => removeServer(item)}>REMOVE</button>
            </td>
          </>
        )}
        {props.type !== 'SERVERS' && (
          <>
            <td>{item.status}</td>
            <td>
              <button onClick={() => removeServer(item)}>REMOVE</button>
            </td>
          </>
        )}
      </tr>
    );
  });

  return (
    <>
      <hr />
      {props.type === 'SERVERS' ? <h3>Available Servers</h3> : <h3>Tasks</h3>}
      <table>
        <thead>
          <tr>
            {props.type !== 'SERVERS' && (
              <>
                <th>Task</th>
                <th>Status</th>
                <th>Progress</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  // 3 Servers are always available
  const [servers, setServers] = useState([
    {
      id: 71684978,
      name: 'SERV71684978',
      status: 'AV',
    },
    {
      id: 80345261,
      name: 'SERV80345261',
      status: 'AV',
    },
    {
      id: 19538674,
      name: 'SERV19538674',
      status: 'AV',
    },
  ]);

  const [currentTask, setCurrentTask] = useState({});
  const [availableServers, setAvailableServers] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [tasksInProgress, setTasksInProgress] = useState([]);

  useEffect(() => {
    //set available servers
    let avServers = servers.filter((server) => {
      return server.status === 'AV';
    });
    setAvailableServers(avServers);
  }, [servers]);

  useEffect(() => {
    if (availableServers.length && pendingTasks.length) {
      const task = pendingTasks[0];
      const server = availableServers[0];
      executeTask(server, task);
    }
  }, [availableServers]);

  useEffect(() => {
    if (currentTask.name) {
      if (availableServers.length) {
        const server = availableServers[0];
        executeTask(server, currentTask);
      } else {
        setPendingTasks([...pendingTasks, currentTask]);
      }
    }
  }, [currentTask]);

  // useEffect(() => {
  //   console.log('outside', tasksInProgress);
  //   if (tasksInProgress[0].taskId && tasksInProgress[0].serverId) {
  //     console.log('inside');
  //     pendingTasks.forEach((task) => {
  //       if (task.id === tasksInProgress[0].taskId) {
  //         task.status = 'IN-PROG';
  //       }
  //     });
  //     availableServers.forEach((server) => {
  //       if (server.id === tasksInProgress[0].serverId) {
  //         task.status = 'NAV';
  //       }
  //     });
  //   }
  //   // remove server from available servers i.e. change server status to "NAV"
  //   // update task status to "IN-PROG"
  // }, [tasksInProgress]);

  const addServer = () => {
    let serverDetails = {};
    const serverId = Math.floor(Math.random() * Math.pow(10, 8) + 1);
    const serverName = `SERV${serverId}`;
    serverDetails['id'] = serverId;
    serverDetails['name'] = serverName;
    serverDetails['status'] = 'AV';
    if (servers.length < 101) {
      setServers([...servers, serverDetails]);
    }
  };

  const removeServer = (server) => {
    let serverArr = servers.filter((serv) => {
      return serv.id !== server.id;
    });
    setServers(serverArr);
  };

  const addTask = () => {
    const taskId = Math.floor(Math.random() * Math.pow(10, 8) + 1);
    const taskName = `TSK${taskId}`;
    setCurrentTask({
      id: taskId,
      name: taskName,
      status: 'PENDING',
    });
  };

  const executeTask = (server, task) => {
    let taskInProgress = {};
    taskInProgress['task'] = task.name;
    taskInProgress['taskId'] = task.id;
    taskInProgress['server'] = server.name;
    taskInProgress['serverId'] = server.id;
    taskInProgress['progress'] = 0;
    pendingTasks.forEach((task) => {
      if (task.id === taskInProgress.taskId) {
        task.status = 'IN-PROG';
      }
    });

    availableServers.forEach((server) => {
      if (server.id === taskInProgress.serverId) {
        task.status = 'NAV';
      }
    });
    // setTasksInProgress([...tasksInProgress, taskInProgress]);
  };

  return (
    <div>
      <h2>TASK MANAGER</h2>
      <hr />
      <button onClick={addServer}>Add Server</button>
      <button onClick={addTask}>Add Task</button>
      <TableContent
        type="SERVERS"
        list={availableServers}
        removeServer={removeServer}
      />
      <TableContent type="TASKS" list={pendingTasks} />
    </div>
  );
}
