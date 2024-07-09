import React, { useState, useRef, useCallback, useContext } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHorizOutlined";
import { MenuComponent } from "../../component/genericChatModules/components/ProrityDropdown";
import ChatList from "../../component/genericChatModules/ChatList";
import InputUpload from "../../component/genericChatModules/components/QueryInput";
import { ChatContext } from "../../chatContext";
import { ENUM, useTheme } from "../../updated_version/Context/themeContext";
import { queryChat, uploadFile } from "../../apis/rbacLLM.api";
import {
  MessageFrom,
  MessageGen,
} from "../../component/genericChatModules/message.type";
import { AristotleLogo } from "../../component/genericChatModules/icons/logo";

const menuOptions = [
  { label: "User", value: "user" },
  { label: "NIDeltaRole", value: "NIDeltaRole" },
  { label: "DLDeltaRole", value: "DLDeltaRole" },
];

const GovernanceAI = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(menuOptions[0]);
  const { Rbacllm_clone } = useContext(ChatContext);
  const { messages, addNewMessage } = Rbacllm_clone;
  const [query, setQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [error, setError] = useState(null);
  const open = Boolean(anchorEl);
  const { theme } = useTheme();

  //Handle to Open the Menu//
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);

  //Handler to Close Options Menu//
  const handleClose = () => setAnchorEl(null);

  //When User Select Options//
  const handleUserSelection = (user) => {
    setSelectedUser(user);
    handleClose();
  };

  //AJAX When Click Button or Enter //
  const handleSubmitQueryOrUpload = useCallback(async () => {
    setIsThinking(true);
    setError(null);
    if (file && query.trim()) {
      setQuery("");
      addNewMessage(new MessageGen("file", MessageFrom.USER, file));
      const uploadResult = await uploadFile(file);
      uploadResult.match({
        Ok: (data) => {
          addNewMessage(
            new MessageGen(
              "text",
              MessageFrom.AI,
              "This is a simulated response coming from GEN AI"
            )
          );
          setIsThinking(false);
          setFile(null);
          if (fileInputRef && fileInputRef.current)
            fileInputRef.current.value = "";
        },
        Err: (error) => {
          addNewMessage(new MessageGen("error", MessageFrom.AI, error));
          setIsThinking(false);
          setError(error);
          if (fileInputRef && fileInputRef.current)
            fileInputRef.current.value = "";
        },
      });
    } else if (query.trim() && file === null) {
      const textQuery = query.trim();
      addNewMessage(new MessageGen("text", MessageFrom.USER, textQuery));
      setQuery("");
      const queryResult = await queryChat(selectedUser.value, textQuery);
      queryResult.match({
        Ok: (data) => {
          addNewMessage(new MessageGen("text", MessageFrom.AI, data.answer));
          setIsThinking(false);
        },
        Err: (error) => {
          addNewMessage(new MessageGen("error", MessageFrom.AI, error));
          setError(error);
          setIsThinking(false);
        },
      });
    } else {
      setError("Please provide a query and/or file.");
      addNewMessage(new MessageGen("error", MessageFrom.USER, error));
      setIsThinking(false);
    }
  }, [query, file, selectedUser.value, addNewMessage]);

  //When file is uploaded
  const handleFileUpload = (event) => {
    if (event.target.files.length) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      setQuery(uploadedFile.name);
    }
  };

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
              ml: 5,
              fontFamily: "var(--fontFamily)",
              mt: 6,
            }}
          >
            Governance AI
          </Typography>
        </Box>
        <Tooltip title="Options">
          <IconButton onClick={handleMenuClick}>
            <MoreHorizIcon sx={{ color: "var(--color-accent)" }} />
          </IconButton>
        </Tooltip>
        <MenuComponent
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
          menuOptions={menuOptions}
          selectedValue={selectedUser}
          selectedValueHandler={handleUserSelection}
        />
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
            fileInputRef={fileInputRef}
            handleFileButtonClick={() =>
              fileInputRef.current ? fileInputRef.current.click() : null
            }
            handleFileUpload={handleFileUpload}
            handleSubmit={handleSubmitQueryOrUpload}
            isThinking={isThinking}
            query={query}
            setQuery={setQuery}
            setIsInputFocused={setIsInputFocused}
            placeholder={"Message Governance AI"}
            supportFileType={".csv"}
            isShowUpload={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default GovernanceAI;
