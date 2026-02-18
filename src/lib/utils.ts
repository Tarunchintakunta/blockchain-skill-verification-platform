import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function calculateMatchScore(
  candidateSkills: { skillId: string; level: number; verified: boolean }[],
  requiredSkills: { skillId: string; minLevel: number }[],
  preferredSkills: { skillId: string; minLevel: number }[]
): number {
  if (requiredSkills.length === 0) return 0;

  let totalScore = 0;
  let maxScore = 0;

  for (const req of requiredSkills) {
    maxScore += 100;
    const candidate = candidateSkills.find((s) => s.skillId === req.skillId);
    if (candidate) {
      const levelMatch = Math.min(candidate.level / req.minLevel, 1) * 80;
      const verifiedBonus = candidate.verified ? 20 : 0;
      totalScore += levelMatch + verifiedBonus;
    }
  }

  for (const pref of preferredSkills) {
    maxScore += 50;
    const candidate = candidateSkills.find((s) => s.skillId === pref.skillId);
    if (candidate) {
      const levelMatch = Math.min(candidate.level / pref.minLevel, 1) * 40;
      const verifiedBonus = candidate.verified ? 10 : 0;
      totalScore += levelMatch + verifiedBonus;
    }
  }

  return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
}

export function generateAssessmentQuestions(
  skillName: string,
  difficulty: string,
  count: number
): {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}[] {
  const questions = getQuestionBank(skillName, difficulty);
  const shuffled = questions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getQuestionBank(
  skillName: string,
  difficulty: string
): {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}[] {
  const banks: Record<string, Record<string, ReturnType<typeof getQuestionBank>>> = {
    JavaScript: {
      beginner: [
        { id: "js-b-1", question: "What is the output of typeof null?", options: ["null", "undefined", "object", "boolean"], correctAnswer: 2, explanation: "typeof null returns 'object' due to a historical bug in JavaScript.", points: 10 },
        { id: "js-b-2", question: "Which method converts a JSON string to a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.toObject()"], correctAnswer: 1, explanation: "JSON.parse() parses a JSON string and constructs the JavaScript value.", points: 10 },
        { id: "js-b-3", question: "What does the === operator check?", options: ["Value only", "Type only", "Value and type", "Reference"], correctAnswer: 2, explanation: "The strict equality operator checks both value and type.", points: 10 },
        { id: "js-b-4", question: "Which keyword declares a block-scoped variable?", options: ["var", "let", "both", "neither"], correctAnswer: 1, explanation: "let declares a block-scoped local variable.", points: 10 },
        { id: "js-b-5", question: "What is a closure in JavaScript?", options: ["A loop structure", "A function with access to outer scope", "An object method", "A class constructor"], correctAnswer: 1, explanation: "A closure is a function that retains access to its lexical scope.", points: 10 },
      ],
      intermediate: [
        { id: "js-i-1", question: "What is the event loop responsible for?", options: ["DOM rendering", "Managing async operations", "Memory allocation", "Type checking"], correctAnswer: 1, explanation: "The event loop handles asynchronous callbacks in JavaScript.", points: 15 },
        { id: "js-i-2", question: "What does Promise.all() return if one promise rejects?", options: ["All results", "Partial results", "Rejected promise", "Undefined"], correctAnswer: 2, explanation: "Promise.all() rejects immediately if any promise rejects.", points: 15 },
        { id: "js-i-3", question: "What is the purpose of the Symbol type?", options: ["Mathematical operations", "Unique identifiers", "String formatting", "Array indexing"], correctAnswer: 1, explanation: "Symbols create unique identifiers for object properties.", points: 15 },
        { id: "js-i-4", question: "What pattern does async/await implement?", options: ["Observer", "Iterator", "Promise-based flow", "Singleton"], correctAnswer: 2, explanation: "async/await is syntactic sugar over Promises for cleaner async code.", points: 15 },
        { id: "js-i-5", question: "What is the Temporal Dead Zone?", options: ["Memory leak area", "Period before let/const initialization", "Garbage collection phase", "Event loop stage"], correctAnswer: 1, explanation: "The TDZ is the period between entering scope and variable declaration.", points: 15 },
      ],
      advanced: [
        { id: "js-a-1", question: "What is the difference between WeakMap and Map?", options: ["No difference", "WeakMap keys are weakly held", "WeakMap is faster", "Map uses more memory"], correctAnswer: 1, explanation: "WeakMap holds weak references to keys, allowing garbage collection.", points: 20 },
        { id: "js-a-2", question: "What does Object.freeze() NOT prevent?", options: ["Adding properties", "Modifying nested objects", "Deleting properties", "Changing values"], correctAnswer: 1, explanation: "Object.freeze() is shallow; nested objects can still be modified.", points: 20 },
        { id: "js-a-3", question: "What is a generator function?", options: ["A factory function", "A function that can pause execution", "A constructor", "An async function"], correctAnswer: 1, explanation: "Generators can pause and resume execution using yield.", points: 20 },
        { id: "js-a-4", question: "What is the Proxy object used for?", options: ["Network requests", "Intercepting object operations", "Worker threads", "Module loading"], correctAnswer: 1, explanation: "Proxy enables custom behavior for fundamental object operations.", points: 20 },
        { id: "js-a-5", question: "What is tail call optimization?", options: ["Loop unrolling", "Reusing stack frame for tail-position calls", "Caching results", "Lazy evaluation"], correctAnswer: 1, explanation: "TCO reuses the current stack frame for function calls in tail position.", points: 20 },
      ],
    },
    Python: {
      beginner: [
        { id: "py-b-1", question: "What is the output of type([])?", options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'set'>"], correctAnswer: 1, explanation: "[] creates a list in Python.", points: 10 },
        { id: "py-b-2", question: "How do you create a dictionary in Python?", options: ["[]", "()", "{}", "<>"], correctAnswer: 2, explanation: "Curly braces {} are used to create dictionaries.", points: 10 },
        { id: "py-b-3", question: "What does len() return for a string?", options: ["Word count", "Character count", "Byte count", "Line count"], correctAnswer: 1, explanation: "len() returns the number of characters in a string.", points: 10 },
        { id: "py-b-4", question: "What keyword starts a function definition?", options: ["function", "func", "def", "fn"], correctAnswer: 2, explanation: "The def keyword is used to define functions in Python.", points: 10 },
        { id: "py-b-5", question: "Which operator is used for exponentiation?", options: ["^", "**", "^^", "exp"], correctAnswer: 1, explanation: "** is the exponentiation operator in Python.", points: 10 },
      ],
      intermediate: [
        { id: "py-i-1", question: "What is a decorator in Python?", options: ["A design pattern", "A function that modifies another function", "A class method", "A type hint"], correctAnswer: 1, explanation: "Decorators wrap functions to modify their behavior.", points: 15 },
        { id: "py-i-2", question: "What is the GIL?", options: ["A package manager", "Global Interpreter Lock", "A testing framework", "A data structure"], correctAnswer: 1, explanation: "The GIL prevents multiple threads from executing Python code simultaneously.", points: 15 },
        { id: "py-i-3", question: "What is a list comprehension?", options: ["A loop", "A concise way to create lists", "A sorting algorithm", "A class method"], correctAnswer: 1, explanation: "List comprehensions provide a compact syntax for creating lists.", points: 15 },
        { id: "py-i-4", question: "What does yield do in a function?", options: ["Returns and exits", "Pauses and produces a value", "Raises an error", "Creates a class"], correctAnswer: 1, explanation: "yield pauses the function and returns a value to the caller.", points: 15 },
        { id: "py-i-5", question: "What is the difference between __str__ and __repr__?", options: ["No difference", "__str__ is for users, __repr__ for developers", "__repr__ is deprecated", "__str__ is faster"], correctAnswer: 1, explanation: "__str__ is for readable output; __repr__ is for unambiguous representation.", points: 15 },
      ],
      advanced: [
        { id: "py-a-1", question: "What is a metaclass?", options: ["A base class", "A class of a class", "An abstract class", "A mixin"], correctAnswer: 1, explanation: "Metaclasses define how classes themselves are created.", points: 20 },
        { id: "py-a-2", question: "What is the descriptor protocol?", options: ["Network protocol", "Object attribute access mechanism", "File I/O system", "Memory management"], correctAnswer: 1, explanation: "Descriptors define how attribute access is handled via __get__, __set__, __delete__.", points: 20 },
        { id: "py-a-3", question: "What is the MRO in Python?", options: ["Memory Reference Object", "Method Resolution Order", "Module Resource Optimizer", "Multi-Return Operation"], correctAnswer: 1, explanation: "MRO determines the order in which base classes are searched.", points: 20 },
        { id: "py-a-4", question: "What are slots in a Python class?", options: ["Method decorators", "Fixed attribute declarations", "Thread locks", "Memory pools"], correctAnswer: 1, explanation: "__slots__ prevents dynamic attribute creation, saving memory.", points: 20 },
        { id: "py-a-5", question: "What is monkey patching?", options: ["Error handling", "Dynamically modifying code at runtime", "Unit testing", "Code optimization"], correctAnswer: 1, explanation: "Monkey patching modifies or extends code at runtime without altering source.", points: 20 },
      ],
    },
    Solidity: {
      beginner: [
        { id: "sol-b-1", question: "What is a smart contract?", options: ["A legal document", "Self-executing code on blockchain", "A web API", "A database"], correctAnswer: 1, explanation: "Smart contracts are self-executing programs stored on a blockchain.", points: 10 },
        { id: "sol-b-2", question: "What is the primary unit of Ether?", options: ["Gwei", "Wei", "Finney", "Ether"], correctAnswer: 1, explanation: "Wei is the smallest unit of Ether (1 ETH = 10^18 Wei).", points: 10 },
        { id: "sol-b-3", question: "What visibility keyword makes a function accessible only within the contract?", options: ["public", "external", "private", "internal"], correctAnswer: 2, explanation: "private restricts access to the defining contract only.", points: 10 },
        { id: "sol-b-4", question: "What is msg.sender?", options: ["Contract address", "Current caller address", "Block miner", "Network ID"], correctAnswer: 1, explanation: "msg.sender is the address that called the current function.", points: 10 },
        { id: "sol-b-5", question: "What does the 'payable' modifier do?", options: ["Makes function free", "Allows function to receive Ether", "Adds logging", "Enables events"], correctAnswer: 1, explanation: "payable allows a function to receive Ether.", points: 10 },
      ],
      intermediate: [
        { id: "sol-i-1", question: "What is the purpose of the ERC-721 standard?", options: ["Fungible tokens", "Non-fungible tokens", "Governance", "Staking"], correctAnswer: 1, explanation: "ERC-721 is the standard for non-fungible tokens (NFTs).", points: 15 },
        { id: "sol-i-2", question: "What is a reentrancy attack?", options: ["DDoS attack", "Recursive call exploitation", "Phishing", "DNS hijacking"], correctAnswer: 1, explanation: "Reentrancy exploits recursive calls to drain funds before state updates.", points: 15 },
        { id: "sol-i-3", question: "What does the 'view' modifier indicate?", options: ["Function modifies state", "Function only reads state", "Function is deprecated", "Function is payable"], correctAnswer: 1, explanation: "view functions read state but do not modify it.", points: 15 },
        { id: "sol-i-4", question: "What is the purpose of events in Solidity?", options: ["Error handling", "Logging and external monitoring", "State mutation", "Access control"], correctAnswer: 1, explanation: "Events log data on the blockchain for external consumers.", points: 15 },
        { id: "sol-i-5", question: "What is gas in Ethereum?", options: ["A cryptocurrency", "Computational cost unit", "A consensus mechanism", "A data type"], correctAnswer: 1, explanation: "Gas measures the computational effort required to execute operations.", points: 15 },
      ],
      advanced: [
        { id: "sol-a-1", question: "What is the proxy pattern used for?", options: ["Gas optimization", "Upgradeable contracts", "Token creation", "Oracle integration"], correctAnswer: 1, explanation: "Proxy patterns enable contract upgradeability via delegatecall.", points: 20 },
        { id: "sol-a-2", question: "What is the difference between call and delegatecall?", options: ["No difference", "delegatecall preserves caller context", "call is deprecated", "delegatecall is faster"], correctAnswer: 1, explanation: "delegatecall executes code in the context of the calling contract.", points: 20 },
        { id: "sol-a-3", question: "What is the check-effects-interactions pattern?", options: ["A UI pattern", "Security pattern for state changes", "Testing methodology", "Gas optimization"], correctAnswer: 1, explanation: "This pattern prevents reentrancy by ordering checks, state changes, then external calls.", points: 20 },
        { id: "sol-a-4", question: "What is EIP-1967?", options: ["Token standard", "Proxy storage slot standard", "Governance protocol", "Bridge protocol"], correctAnswer: 1, explanation: "EIP-1967 standardizes storage slots for proxy contracts.", points: 20 },
        { id: "sol-a-5", question: "What is the diamond pattern (EIP-2535)?", options: ["Token standard", "Multi-facet proxy pattern", "NFT metadata standard", "Staking protocol"], correctAnswer: 1, explanation: "The diamond pattern allows unlimited contract functionality via facets.", points: 20 },
      ],
    },
  };

  const skillBank = banks[skillName] || banks["JavaScript"];
  const difficultyBank = skillBank?.[difficulty] || skillBank?.["beginner"];
  return difficultyBank || banks["JavaScript"]["beginner"];
}

export function analyzeAssessmentResults(
  answers: Record<string, number>,
  questions: {
    id: string;
