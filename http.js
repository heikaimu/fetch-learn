/**
 * 二进制家族：Blob、ArrayBuffer和Buffer
 * Blob: 前端的一个支持文件操作的二进制对象
 * ArrayBuffer: 前端一个通用的二进制缓冲区，类似数组
 * Buffer: Node.js 提供的一个二进制缓冲区，用于处理I/O操作
 */

function get(url, timeout = 20000) {
  return new Promise((resolve, reject) => {
    // 设置超时
    const controller = new AbortController();
    const { signal } = controller;
    signal.onabort = function () {
      reject('timeout');
    }
    setTimeout(() => {
      controller.abort();
    }, timeout);

    // 进度
    // const logProgress = (res) => {
    //   const total = res.headers.get('content-length');
    //   let loaded = 0;
    //   const reader = res.body.getReader();
    //   const stream = new ReadableStream({
    //     start(controller) {
    //       const push = () => {
    //         reader.read().then(({ value, done }) => {
    //           if (done) {
    //             console.log('已经完成')
    //             controller.close();
    //             return;
    //           }

    //           loaded += value.length;
    //           if (total === null) {
    //             console.log(`Downloaded ${loaded}`);
    //           } else {
    //             console.log(`Downloaded ${loaded} of ${total} (${(loaded / total * 100).toFixed(2)}%)`);
    //           }
    //           controller.enqueue(value);
    //           push();
    //         })
    //       }
    //       push();
    //     }
    //   })
    //   return new Response(stream, { headers: res.headers });
    // }
    const logProgress = (res) => {
      const total = res.headers.get('content-length');
      let loaded = 0;
      // 构造两个一样的流，一个用于返回，一个用于进度
      const [progressStream, returnStream] = res.body.tee();
      const reader = progressStream.getReader();
      const log = () => {
        reader.read().then(({ value, done }) => {
          if (done) {
            console.log('已经完成')
            return;
          }

          loaded += value.length;
          if (total === null) {
            console.log(`Downloaded ${loaded}`);
          } else {
            console.log(`Downloaded ${loaded} of ${total} (${(loaded / total * 100).toFixed(2)}%)`);
          }
          log();
        })
      };
      log();
      return new Response(returnStream, { headers: res.headers });
    }

    // 发起请求
    fetch(url, { signal })
      .then(logProgress)
      .then(res => res.blob())
      .then(blob => {
        console.log(blob);
      })
  })
}

// blob转文本
function _toText(blob) {
  const reader = new FileReader();
  reader.onload = function () {
    const content = reader.result;
    console.log(content);
  }
  reader.readAsText(blob);
}

// blob转arrayBuffer
function _toArrayBuffer(blob) {
  const reader = new FileReader();
  reader.onload = function () {
    const content = reader.result;
    console.log(content);
  }
  reader.readAsArrayBuffer(blob);
}

// blob分片
function _chunk(blob, chunkSize) {
  const size = blob.size;
  let start = 0;
  let end = chunkSize;
  while (start < size) {
    const chunkBlob = blob.slice(start, end);
    start = end;
    end += chunkSize;

    console.log(chunkBlob);
  }
}

export {
  get
}