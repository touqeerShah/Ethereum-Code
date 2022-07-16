// SPDX-License-Identifier: MIT
// 1. Pragma
pragma solidity ^0.8.0;

// 2. Imports
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

// 3. Interfaces, Libraries, Contracts
error Lottery__NOTEnougthETHEnter();
error Lottery__NOTOPEN();
error Lottery__UpKeepNotNeeded(uint256, uint256, uint256);
error Lattery__TransferFailed();

/**@title A lottery contract
 * @author Touqeer Shah
 * @notice This contract is for creating a lottery and select random winner
 * @dev This implements oracle as our library
 */
contract Lottery is VRFConsumerBaseV2, KeeperCompatibleInterface {
    // types declearation
    enum LotteryState {
        OPEN,
        CALCULATE
    }

    // State variables
    uint256 private immutable i_entrnaceFee; //i_ denote immutable varable which mean it will be write only once
    address payable[] private s_player;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLine;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFORMATIONS = 3;
    uint16 private constant NUM_WORDS = 1;

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

    // Modifiers
    // Lottery Variables
    uint256 private immutable i_interval;
    uint256 private s_lastTimeStamp;
    address private s_recentWinner;
    uint256 private i_entranceFee;
    address payable[] private s_players;

    LotteryState private s_lotteryState;
    // Events
    event LotteryEnter(address indexed player);
    event RequestForRandomNumber(uint256 indexed requidID);
    event WinnerPicked(address indexed player);

    constructor(
        address vrfCoordinatorV2,
        uint256 entrnaceFee,
        uint64 subscriptionId,
        bytes32 gasLine,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entrnaceFee = entrnaceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLine = gasLine;
        i_callbackGasLimit = callbackGasLimit;
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enternaceLottery() public payable {
        if (msg.value < i_entrnaceFee) {
            revert Lottery__NOTEnougthETHEnter();
        }
        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery__NOTOPEN();
        }

        s_player.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

    function fulfillRandomWords(
        uint256, /*requestId*/
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_players = new address payable[](0);
        s_lotteryState = LotteryState.OPEN;
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        // require(success, "Transfer failed");
        if (!success) {
            revert Lattery__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    // function requestRandomWords() external onlyOwner {
    //     // Will revert if subscription is not set and funded.
    //     s_lotteryState = LotteryState.CALCULATE;

    //     uint256 requestID = i_vrfCoordinator.requestRandomWords(
    //         i_gasLine,
    //         s_subscriptionId,
    //         REQUEST_CONFORMATIONS,
    //         i_callbackGasLimit,
    //         NUM_WORDS
    //     );
    //     emit RequestForRandomNumber(requestID);
    // }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = (s_lotteryState == LotteryState.OPEN);
        bool timePass = (block.timestamp - s_lastTimeStamp) > i_interval;
        bool hasPlayer = (s_players.length > 0);
        bool hasBalance = (address(this).balance > 0);
        upkeepNeeded = (isOpen && timePass && hasPlayer && hasBalance);
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        // Will revert if subscription is not set and funded.
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Lottery__UpKeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_lotteryState)
            );
        }
        s_lotteryState = LotteryState.CALCULATE;

        uint256 requestID = i_vrfCoordinator.requestRandomWords(
            i_gasLine,
            i_subscriptionId,
            REQUEST_CONFORMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestForRandomNumber(requestID);
    }

    /** Getter Functions */

    function getRaffleState() public view returns (LotteryState) {
        return s_lotteryState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFORMATIONS;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }
}
