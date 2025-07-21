"use client";
import React, { useState } from "react";
import { CreateUserDialog } from "@/components/create-user-dialog";
import { Button } from "@/components/ui/button";

const CreateUserDialogTrigger = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Create User
      </Button>

      <div className="absolute">
        <CreateUserDialog open={open} onOpenChange={setOpen} />
      </div>
    </>
  );
};

export default CreateUserDialogTrigger;
