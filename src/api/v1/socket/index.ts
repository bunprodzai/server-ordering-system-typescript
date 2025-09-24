import { Server } from "socket.io";
import http from "http";

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // FE chạy ở domain nào thì cho phép ở đây
      methods: ["GET", "POST"],
    },
  });

  // Khi client connect
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Client join vào 1 room = table_id
    socket.on("joinTable", (tableId) => {
      socket.join(tableId);
      console.log(`Socket ${socket.id} joined table ${tableId}`);
    });

    // Cập nhật giỏ hàng từ client
    socket.on("updateCart", (data) => {
      const { tableId, totalQuantityItem } = data;

      // Gửi cho tất cả client khác cùng bàn
      socket.to(tableId).emit("cartUpdated", { totalQuantityItem: totalQuantityItem });

      // 🚀 Emit cho ADMIN biết bàn đó có update
      io.emit("tableUpdated", { tableId, totalQuantityItem });
    });


    // Khi khách hàng nhấn đặt món
    socket.on("ordered", (data) => {
      const { tableId } = data;

      // Gửi cho tất cả client khác cùng bàn
      socket.to(tableId).emit("orderedUpdated", { tableId });

      // 🚀 Emit cho ADMIN biết bàn đó có đặt món
      io.emit("tableOrdered", { tableId });
    });


    // Cập nhật giỏ hàng đã đặt từ admin
    socket.on("updateOrderedAuth", (data) => {
      const { tableId } = data;
      console.log("Cập nhật giỏ hàng từ admin");

      // Gửi cho tất cả client khác cùng bàn
      socket.to(tableId).emit("orderedUpdatedAuth", { tableId });
    });

    // Hủy bàn từ admin
    socket.on("cancelTable", (data) => {
      const { tableId } = data;

      // Gửi cho tất cả client khác cùng bàn
      socket.to(tableId).emit("cancelTableAuth", { tableId });
    });

    // Hoàn thành đơn hàng từ admin
    socket.on("successTable", (data) => {
      const { tableId } = data;

      // Gửi cho tất cả client khác cùng bàn
      socket.to(tableId).emit("successTableAuth", { tableId });
    });

    // Nhận sự kiện thanh toán thành công từ client
    socket.on("successOrder", (data) => {
      const { tableId, code, status, paymentAt } = data;
      console.log(tableId);

      // 🚀 Emit cho ADMIN biết thanh toán thành công
      io.emit("clientSuccessOrder", { tableId, code, status, paymentAt });
    });



    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
