import { log } from "@graphprotocol/graph-ts";
import {
  DistributeReservedTokens,
  DistributeToReservedTokenSplit,
  MintTokens,
} from "../../../generated/V3JBController/JBController";
import {
  DistributeReservedTokensEvent,
  DistributeToReservedTokenSplitEvent,
  MintTokensEvent,
} from "../../../generated/schema";
import { CV, ProjectEventKey } from "../../types";
import { saveNewProjectEvent } from "../../utils/entity";
import { idForProject, idForProjectTx } from "../../utils/ids";
import { cvForV2_V3Project } from "../../utils/cv";

export function handleMintTokens(event: MintTokens): void {
  const cv = cvForV2_V3Project(event.params.projectId);

  // Note: Receiver balance is updated in the jbTokenStore event handler

  const mintTokensEvent = new MintTokensEvent(
    idForProjectTx(event.params.projectId, cv, event, true)
  );
  const projectId = idForProject(event.params.projectId, cv);
  if (!mintTokensEvent) {
    log.error("[handleMintTokens] Missing mintTokensEvent. ID:{}", [
      idForProjectTx(event.params.projectId, cv, event, true),
    ]);
    return;
  }
  mintTokensEvent.cv = cv;
  mintTokensEvent.projectId = event.params.projectId.toI32();
  mintTokensEvent.amount = event.params.tokenCount;
  mintTokensEvent.beneficiary = event.params.beneficiary;
  mintTokensEvent.caller = event.transaction.from;
  mintTokensEvent.memo = event.params.memo;
  mintTokensEvent.project = projectId;
  mintTokensEvent.timestamp = event.block.timestamp.toI32();
  mintTokensEvent.txHash = event.transaction.hash;
  mintTokensEvent.save();

  saveNewProjectEvent(
    event,
    event.params.projectId,
    mintTokensEvent.id,
    cv,
    ProjectEventKey.mintTokensEvent
  );
}

export function handleDistributeReservedTokens(
  event: DistributeReservedTokens
): void {
  const cv = cvForV2_V3Project(event.params.projectId);

  const projectId = idForProject(event.params.projectId, cv);
  const distributeReservedTokensEvent = new DistributeReservedTokensEvent(
    idForProjectTx(event.params.projectId, cv, event)
  );

  if (!distributeReservedTokensEvent) return;
  distributeReservedTokensEvent.project = projectId;
  distributeReservedTokensEvent.projectId = event.params.projectId.toI32();
  distributeReservedTokensEvent.txHash = event.transaction.hash;
  distributeReservedTokensEvent.timestamp = event.block.timestamp.toI32();
  distributeReservedTokensEvent.fundingCycleNumber = event.params.fundingCycleNumber.toI32();
  distributeReservedTokensEvent.caller = event.transaction.from;
  distributeReservedTokensEvent.beneficiary = event.params.beneficiary;
  distributeReservedTokensEvent.tokenCount = event.params.tokenCount;
  distributeReservedTokensEvent.beneficiaryTokenCount =
    event.params.beneficiaryTokenCount;
  distributeReservedTokensEvent.memo = event.params.memo;
  distributeReservedTokensEvent.save();

  saveNewProjectEvent(
    event,
    event.params.projectId,
    distributeReservedTokensEvent.id,
    cv,
    ProjectEventKey.distributeReservedTokensEvent
  );
}

export function handleDistributeToReservedTokenSplit(
  event: DistributeToReservedTokenSplit
): void {
  const cv = cvForV2_V3Project(event.params.projectId);

  const projectId = idForProject(event.params.projectId, cv);
  const distributeReservedTokenSplitEvent = new DistributeToReservedTokenSplitEvent(
    idForProjectTx(event.params.projectId, cv, event, true)
  );

  if (!distributeReservedTokenSplitEvent) {
    log.error(
      "[handleDistributeToReservedTokenSplit] Missing distributeReservedTokenSplitEvent. ID:{}",
      [idForProjectTx(event.params.projectId, cv, event, true)]
    );
    return;
  }

  distributeReservedTokenSplitEvent.distributeReservedTokensEvent = idForProjectTx(
    event.params.projectId,
    cv,
    event
  );
  distributeReservedTokenSplitEvent.project = projectId;
  distributeReservedTokenSplitEvent.projectId = event.params.projectId.toI32();
  distributeReservedTokenSplitEvent.txHash = event.transaction.hash;
  distributeReservedTokenSplitEvent.timestamp = event.block.timestamp.toI32();
  distributeReservedTokenSplitEvent.caller = event.transaction.from;
  distributeReservedTokenSplitEvent.tokenCount = event.params.tokenCount;
  distributeReservedTokenSplitEvent.allocator = event.params.split.allocator;
  distributeReservedTokenSplitEvent.beneficiary =
    event.params.split.beneficiary;
  distributeReservedTokenSplitEvent.lockedUntil = event.params.split.lockedUntil.toI32();
  distributeReservedTokenSplitEvent.percent = event.params.split.percent.toI32();
  distributeReservedTokenSplitEvent.preferClaimed =
    event.params.split.preferClaimed;
  distributeReservedTokenSplitEvent.splitProjectId = event.params.split.projectId.toI32();
  distributeReservedTokenSplitEvent.save();

  saveNewProjectEvent(
    event,
    event.params.projectId,
    distributeReservedTokenSplitEvent.id,
    cv,
    ProjectEventKey.distributeToReservedTokenSplitEvent
  );
}
