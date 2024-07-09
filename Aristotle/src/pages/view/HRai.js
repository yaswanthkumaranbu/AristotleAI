// import React, { useRef, useState, useEffect, Component } from "react";
// import { ChatHeader, ChatContainer, ChatInput } from "../../component/ChatRoom";
// import AdminLayout from "../../component/AdminLayout";
// import ApiService from "../../service/Api.service";
import Chat from "../../component/Chatbot/Chat";
// export default function ChatRoom() {
//   // TODO: Implement Redux and improve theme
//   const [show, setShow] = useState(false);
//   const [data, setData] = useState([]);
//   const inputref = useRef(null);

//   const handleInputSubmit = async (e) => {
//     setShow(true);
//     e.preventDefault();
//     console.log(inputref.current.value);
//     if (inputref.current.value === "") return;
//     var data = inputref.current.value;
//     setData((cr) => [
//       ...cr,
//       {
//         from: "user",
//         message: data,
//       },
//     ]);

//     inputref.current.value = "";
//     let gaiRes = await ApiService.httpGet("/gai/chat?q=" + data);

//     setData((cr) => [
//       ...cr,
//       {
//         from: "llm",
//         message: gaiRes,
//       },
//     ]);
//   };

//   const bottomref = useRef(null);
//   useEffect(() => {
//     bottomref.current?.scrollIntoView({ behavior: "smooth" });
//   }, [data]);

//   //TODO add a fab to scroll up to the top
//   return (
//     <div>
//       <div>
//         <div className="tw-w-full tw-h-[100vh] tw-relative tw-flex tw-flex-col">
//           <div className="tw-flex tw-flex-col tw-min-h-[100vh] tw-overflow-y-auto tw-pb-32 tw-scrollbar-thin tw-scrollbar-thumb-gray-600 tw-scrollbar-track-theme-black tw-scrollbar-thumb-rounded-md">
//             {show ? <ChatHeader initial_model="HR AI" /> : <></>}
//             <ChatContainer chatdata={data} image="/assets/icons/hr.png" />

//             <div ref={bottomref} />
//           </div>
//           <ChatInput
//             input={inputref}
//             handleSubmit={handleInputSubmit}
//             style={{ color: "white" }}
//           />
//         </div>
//       </div>
//       <div>
//         <Chat />
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useCallback, useContext } from "react";
import { Box, Typography } from "@mui/material";
import ChatList from "../../component/genericChatModules/ChatList";
import InputUpload from "../../component/genericChatModules/components/QueryInput";
import { ChatContext } from "../../chatContext";
import { ENUM, useTheme } from "../../updated_version/Context/themeContext";
import {
  MessageFrom,
  MessageGen,
} from "../../component/genericChatModules/message.type";
import { AristotleLogo } from "../../component/genericChatModules/icons/logo";
import { queryHRAI } from "../../apis/hr.api";

const ChatRoom = () => {
  const { HRAI } = useContext(ChatContext);
  const { messages, addNewMessage } = HRAI;
  const [query, setQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  //AJAX When Click Button or Enter //
  const handleSubmitQueryOrUpload = useCallback(async () => {
    setIsThinking(true);
    setError(null);
    if (query.trim()) {
      const textQuery = query.trim();
      addNewMessage(new MessageGen("text", MessageFrom.USER, textQuery));
      setQuery("");
      const queryResult = await queryHRAI(textQuery);
      queryResult.match({
        Ok: (data) => {
          addNewMessage(new MessageGen("text", MessageFrom.AI, data));
          setIsThinking(false);
        },
        Err: (error) => {
          addNewMessage(new MessageGen("error", MessageFrom.AI, error));
          setError(error);
          setIsThinking(false);
        },
      });
    } else {
      setError("Please provide a query...");
      addNewMessage(new MessageGen("error", MessageFrom.USER, error));
      setIsThinking(false);
    }
  }, [query, addNewMessage]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      sx={{ flexGrow: 1, m: "auto" }}
      width={"100%"}
      height={"100%"}
      justifyContent={"space-between"}
    >
      <Box display="flex" justifyContent="flex-end" p={1}>
        <Box alignSelf={"center"} width={"100%"}>
          <Typography
            variant="h5"
            textAlign={"center"}
            sx={{
              fontWeight: "bold",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              color: "var(--color-accent)",
              fontFamily: "var(--fontFamily)",
              mt: 6,
            }}
          >
            HRAI
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        sx={{ overflow: "hidden" }}
        maxHeight={"100vh"}
        minHeight={550}
      >
        <Box
          p={2}
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent={"flex-end"}
          maxHeight={490}
          position={"relative"}
        >
          <ChatList
            chatData={messages}
            isThinking={isThinking}
            file={undefined}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          width={"70%"}
          m={"0px auto"}
          mt={3}
          borderRadius={5}
          justifySelf={"flex-end"}
          sx={{
            border: `0.5px solid ${
              isInputFocused
                ? "var(--color-accent)"
                : "var(--color-accent-lighter3)"
            }`,
            transition: "border-color 0.3s",
            bgcolor:
              theme === ENUM.LIGHT
                ? "var( --color-input-light)"
                : "var( --color-input-dark)",
          }}
        >
          <InputUpload
            handleSubmit={handleSubmitQueryOrUpload}
            isThinking={isThinking}
            query={query}
            setQuery={setQuery}
            setIsInputFocused={setIsInputFocused}
            placeholder={"Message HRAI"}
            isShowUpload={false}
          />
        </Box>
      </Box>
      <Chat />
    </Box>
  );
};

export default ChatRoom;
